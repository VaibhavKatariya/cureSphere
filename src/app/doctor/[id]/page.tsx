'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '@/app/Firebase/config'
import { doc, getDoc, updateDoc, onSnapshot, query, collection, where } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { VideoIcon, MessageSquare, Star, Clock, Globe, DollarSign, GraduationCap } from 'lucide-react'
// ...existing code...
import { toast } from "@/hooks/use-toast"
// ...existing code...
import ChatWindow from '@/components/chat/chat-window'
import VideoCall from '@/components/video/video-call'
import { useDocument } from 'react-firebase-hooks/firestore'
import { setDoc, serverTimestamp } from 'firebase/firestore'
import { generateChatId } from '@/lib/utils'

export default function DoctorProfile() {
  const [user] = useAuthState(auth)
  const params = useParams()
  const [doctor, setDoctor] = useState(null)
  const [showChat, setShowChat] = useState(false)
  const [isInCall, setIsInCall] = useState(false)

  // Fetching the document using useDocument hook
  const [value, loading, error] = useDocument(doc(db, 'doctors', params.id))

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
        variant: "destructive"
      })
      return
    }

    const chatId = generateChatId(user.uid, doctor.id)
    try {
      // Initialize chat document if it doesn't exist
      await setDoc(doc(db, 'chats', chatId), {
        participants: [user.uid, doctor.id],
        participantDetails: {
          [user.uid]: {
            name: user.displayName || 'User',
            avatar: user.photoURL || '/placeholder.svg',
            role: 'user'
          },
          [doctor.id]: {
            name: doctor.name,
            avatar: doctor.avatar || '/placeholder.svg',
            role: 'doctor'
          }
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessageTime: serverTimestamp(),
        [`${user.uid}UnreadCount`]: 0,
        [`${doctor.id}UnreadCount`]: 0
      }, { merge: true })

      console.log('Chat initialized:', chatId)
    } catch (error) {
      console.error('Error initializing chat:', error)
      toast({
        title: "Error",
        description: "Failed to start chat",
        variant: "destructive"
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
        variant: "destructive"
      })
      return
    }

    try {
      const callId = `call-${[user.uid, doctor.id].sort().join('-')}`
      // First create the call document
      await setDoc(doc(db, 'calls', callId), {
        from: {
          id: user.uid,
          name: user.displayName || 'User'
        },
        to: {
          id: doctor.id,
          name: doctor.name
        },
        status: 'requesting',
        timestamp: serverTimestamp(),
        expiresAt: new Date(Date.now() + 60000) // 1 minute from now
      })

      // Create a notification for the doctor
      const notificationId = `notif-${Date.now()}`
      await setDoc(doc(db, 'notifications', notificationId), {
        type: 'call',
        message: `Incoming video call from ${user.displayName || 'User'}`,
        doctorId: doctor.id,
        userId: user.uid,
        callId: callId, // Add the callId reference
        read: false,
        createdAt: serverTimestamp()
      })

      setIsInCall(true)
      setShowChat(false)
      toast({
        title: "Calling Doctor",
        description: "Please wait for the doctor to accept your call"
      })

      // Set timeout to handle expired call
      setTimeout(async () => {
        const callDoc = await getDoc(doc(db, 'calls', callId))
        if (callDoc.exists() && callDoc.data().status === 'requesting') {
          await updateDoc(doc(db, 'calls', callId), {
            status: 'expired'
          })
          setIsInCall(false)
          toast({
            title: "Call Expired",
            description: "Doctor did not respond to your call",
            variant: "destructive"
          })
        }
      }, 60000)

    } catch (error) {
      console.error('Error starting call:', error)
      toast({
        title: "Error",
        description: "Failed to start video call",
        variant: "destructive"
      })
    }
  }

  const handleStartChat = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to chat with the doctor",
        variant: "destructive"
      })
      return
    }

    try {
      const chatRequestId = `chat-${[user.uid, doctor.id].sort().join('-')}`
      await setDoc(doc(db, 'chatRequests', chatRequestId), {
        from: {
          id: user.uid,
          name: user.displayName || 'User'
        },
        to: {
          id: doctor.id,
          name: doctor.name
        },
        status: 'pending',
        timestamp: serverTimestamp(),
        expiresAt: new Date(Date.now() + 60000) // 1 minute from now
      })

      toast({
        title: "Chat Request Sent",
        description: "Please wait for the doctor to accept your chat request"
      })

      // Set timeout to handle expired chat request
      setTimeout(async () => {
        const chatDoc = await getDoc(doc(db, 'chatRequests', chatRequestId))
        if (chatDoc.exists() && chatDoc.data().status === 'pending') {
          await updateDoc(doc(db, 'chatRequests', chatRequestId), {
            status: 'expired'
          })
          toast({
            title: "Chat Request Expired",
            description: "Doctor did not respond to your chat request",
            variant: "destructive"
          })
        }
      }, 60000)

    } catch (error) {
      console.error('Error sending chat request:', error)
      toast({
        title: "Error",
        description: "Failed to send chat request",
        variant: "destructive"
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
              callId={callId}
              currentUser={user}
              otherUser={doctor}
              onEndCall={() => setIsInCall(false)}
              isDoctor={false}
            />
          ) : (
            <ChatWindow
              chatId={chatId}
              currentUser={user}
              otherUser={doctor}
            />
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-teal-500 text-white p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-32 h-32 border-4 border-white">
                <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
                <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">{doctor.name}</h1>
                <p className="text-xl mt-2">{doctor.specialty}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                  <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                    <Clock className="w-4 h-4 mr-1" />
                    {doctor.experience}
                  </Badge>
                  <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                    <Star className="w-4 h-4 mr-1" />
                    {doctor.rating}
                  </Badge>
                  <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                    {doctor.availability}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-semibold text-teal-800 mb-4">About</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-teal-700">Introduction</h3>
                    <p className="text-gray-600">{doctor.about || 'No introduction available.'}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-teal-700">Bio</h3>
                    <p className="text-gray-600">{doctor.bio || 'No bio available.'}</p>
                  </div>
                </div>

                <Separator className="my-6" />

                <h2 className="text-2xl font-semibold text-teal-800 mb-4">Education</h2>
                <ul className="space-y-4">
                  {doctor.education?.map((edu, index) => (
                    <li key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-teal-600" />
                        <div>
                          <h4 className="font-medium text-teal-800">{edu.degree}</h4>
                          <p className="text-gray-600">{edu.institution}</p>
                          <p className="text-sm text-gray-500">{edu.year}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                  {(!doctor.education || doctor.education.length === 0) && (
                    <p className="text-gray-500 italic">No education information available.</p>
                  )}
                </ul>
              </div>

              <div>
                <div className="bg-teal-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-teal-800 mb-4">Consultation Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 text-teal-600 mr-2" />
                      <span className="text-gray-600">Languages: {doctor.languages?.join(', ')}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 text-teal-600 mr-2" />
                      <span className="text-gray-600">Consultation Fee: {doctor.consultationFee}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <Button
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                      onClick={handleChat}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat Now
                    </Button>
                    <Button
                      className="w-full bg-teal-100 hover:bg-teal-200 text-teal-800"
                      onClick={handleVideoCall}
                    >
                      <VideoIcon className="w-4 h-4 mr-2" />
                      Video Call
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
