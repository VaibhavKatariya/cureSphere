'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '@/app/Firebase/config'
import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { VideoIcon, MessageSquare, Star, Clock, Globe, DollarSign, GraduationCap } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import ChatWindow from '@/components/chat/chat-window'
import VideoCall from '@/components/video/video-call'
import { useDocument } from 'react-firebase-hooks/firestore'
import { generateChatId } from '@/lib/utils'

export default function DoctorProfile() {
  const [user] = useAuthState(auth)
  const params = useParams()
  const [doctor, setDoctor] = useState<any>(null)
  const [showChat, setShowChat] = useState(false)
  const [isInCall, setIsInCall] = useState(false)

  // Extract ID from params
  const doctorId = Array.isArray(params.id) ? params.id[0] : params.id

  // Fetch the doctor's data using Firestore
  const [value, loading, error] = useDocument(doc(db, 'doctors', doctorId))

  useEffect(() => {
    if (value && value.exists()) {
      setDoctor({ id: value.id, ...value.data() })
    }
  }, [value])

  const handleChat = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to chat with the doctor",
        variant: "destructive",
      })
      return
    }

    const chatId = generateChatId(user.uid, doctor.id)
    try {
      await setDoc(
        doc(db, 'chats', chatId),
        {
          participants: [user.uid, doctor.id],
          participantDetails: {
            [user.uid]: {
              name: user.displayName || 'User',
              avatar: user.photoURL || '/placeholder.svg',
              role: 'user',
            },
            [doctor.id]: {
              name: doctor.name,
              avatar: doctor.avatar || '/placeholder.svg',
              role: 'doctor',
            },
          },
          lastMessageTime: serverTimestamp(),
          [`${user.uid}UnreadCount`]: 0,
          [`${doctor.id}UnreadCount`]: 0,
        },
        { merge: true }
      )
    } catch (error) {
      console.error('Error initializing chat:', error)
      toast({
        title: "Error",
        description: "Failed to start chat",
        variant: "destructive",
      })
      return
    }

    setShowChat(true)
    setIsInCall(false)
  }

  const handleVideoCall = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to start a video call",
        variant: "destructive",
      })
      return
    }

    const callId = `call-${[user.uid, doctor.id].sort().join('-')}`
    try {
      await setDoc(doc(db, 'calls', callId), {
        from: {
          id: user.uid,
          name: user.displayName || 'User',
        },
        to: {
          id: doctor.id,
          name: doctor.name,
        },
        status: 'requesting',
        timestamp: serverTimestamp(),
        expiresAt: new Date(Date.now() + 60000), // 1 minute expiration
      })

      setIsInCall(true)
      setShowChat(false)
      toast({
        title: "Calling Doctor",
        description: "Please wait for the doctor to accept your call",
      })

      setTimeout(async () => {
        const callDoc = await getDoc(doc(db, 'calls', callId))
        if (callDoc.exists() && callDoc.data().status === 'requesting') {
          await updateDoc(doc(db, 'calls', callId), {
            status: 'expired',
          })
          setIsInCall(false)
          toast({
            title: "Call Expired",
            description: "Doctor did not respond to your call",
            variant: "destructive",
          })
        }
      }, 60000)
    } catch (error) {
      console.error('Error starting call:', error)
      toast({
        title: "Error",
        description: "Failed to start video call",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!doctor) {
    return <div>Doctor not found</div>
  }

  const chatId = user ? [user.uid, doctor.id].sort().join('-') : null
  const callId = chatId ? `call-${chatId}` : null

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {(showChat || isInCall) ? (
        <div>
          <Button
            onClick={() => {
              setShowChat(false)
              setIsInCall(false)
            }}
            className="mb-4"
            variant="outline"
          >
            Back to Profile
          </Button>
          {isInCall ? (
            <VideoCall
              callId={callId || ""} // Provide a default value if callId is null
              currentUser={user}
              otherUser={doctor}
              onEndCall={() => setIsInCall(false)}
              isDoctor={false}
            />
          ) : (
            <ChatWindow
              chatId={chatId || ""} // Provide a default value if chatId is null
              currentUser={user}
              otherUser={doctor}
            />
          )}

        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-teal-500 text-white p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-32 h-32 border-4 border-white">
                <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
                <AvatarFallback>
                  {doctor.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">{doctor.name}</h1>
                <p className="text-xl mt-2">{doctor.specialty}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="secondary">
                    <Clock className="w-4 h-4 mr-1" />
                    {doctor.experience}
                  </Badge>
                  <Badge variant="secondary">
                    <Star className="w-4 h-4 mr-1" />
                    {doctor.rating}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">About</h2>
            <p>{doctor.about}</p>
            <Separator className="my-6" />
            <Button onClick={handleChat} className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat Now
            </Button>
            <Button onClick={handleVideoCall} className="w-full mt-4">
              <VideoIcon className="mr-2 h-4 w-4" />
              Video Call
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
