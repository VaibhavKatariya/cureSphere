'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '@/app/Firebase/config'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import ChatWindow from '@/components/chat/chat-window'
import VideoCall from '@/components/video/video-call'
import { Button } from "@/components/ui/button"
import { Phone } from 'lucide-react'
import { onSnapshot, query, collection, where } from 'firebase/firestore'
import CallRequest from '@/components/notifications/call-request'

export default function ConsultationPage() {
  const [user] = useAuthState(auth)
  const params = useParams()
  const [otherUser, setOtherUser] = useState<any>(null)
  const [isInCall, setIsInCall] = useState(false)
  const [loading, setLoading] = useState(true)
  const [callRequest, setCallRequest] = useState<any>(null)
  const searchParams = useSearchParams()
  const isDoctor = otherUser?.role === 'doctor'

  useEffect(() => {
    // Start call immediately if URL has call parameter
    if (searchParams.get('call') === 'true') {
      setIsInCall(true)
    }
    
    // Listen for call requests if user is a doctor
    if (user && isDoctor) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, 'calls'),
          where('to.id', '==', user.uid),
          where('status', '==', 'requesting')
        ),
        (snapshot) => {
          const requests = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          setCallRequest(requests[0] || null)
        }
      )
      return unsubscribe
    }
  }, [user, isDoctor])

  const handleAcceptCall = async () => {
    if (callRequest) {
      await updateDoc(doc(db, 'calls', callRequest.id), {
        status: 'accepted'
      })
      setCallRequest(null)
      setIsInCall(true)
    }
  }

  const handleDeclineCall = async () => {
    if (callRequest) {
      await updateDoc(doc(db, 'calls', callRequest.id), {
        status: 'declined'
      })
      setCallRequest(null)
    }
  }

  useEffect(() => {
    const fetchOtherUser = async () => {
      if (!user) return

      try {
        const docRef = doc(db, params.id.startsWith('dr-') ? 'doctors' : 'users', 
          params.id.replace('dr-', ''))
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          setOtherUser({ id: docSnap.id, ...docSnap.data() })
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOtherUser()
  }, [user, params.id])

  if (loading || !user || !otherUser) {
    return <div>Loading...</div>
  }

  const chatId = [user.uid, otherUser.id].sort().join('-')
  const callId = `call-${chatId}`

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {callRequest && (
        <CallRequest
          callId={callRequest.id}
          callerName={callRequest.from.name}
          onAccept={handleAcceptCall}
          onDecline={handleDeclineCall}
        />
      )}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Consultation with {otherUser.name}
        </h1>
        {!isInCall && (
          <Button onClick={() => setIsInCall(true)}>
            <Phone className="mr-2 h-4 w-4" />
            Start Video Call
          </Button>
        )}
      </div>

      {isInCall ? (
        <VideoCall
          callId={callId}
          currentUser={user}
          otherUser={otherUser}
          onEndCall={() => setIsInCall(false)}
          isDoctor={isDoctor}
        />
      ) : (
        <ChatWindow
          chatId={chatId}
          currentUser={user}
          otherUser={otherUser}
        />
      )}
    </div>
  )
} 