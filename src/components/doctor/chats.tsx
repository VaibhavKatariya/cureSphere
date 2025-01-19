'use client'

import { useState, useEffect } from 'react'
import { db } from '@/app/Firebase/config'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { MessageSquare, Video } from 'lucide-react'

interface ChatSession {
  id: string
  patientId: string
  patientName: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

export default function DoctorChats({ doctorId }: { doctorId: string }) {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchChatSessions()
  }, [])

  const fetchChatSessions = async () => {
    try {
      const q = query(
        collection(db, 'chats'),
        where('doctorId', '==', doctorId),
        orderBy('lastMessageTime', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const sessionsData: ChatSession[] = []
      
      for (const doc of querySnapshot.docs) {
        const data = doc.data()
        // Fetch patient name
        const patientDoc = await getDocs(query(
          collection(db, 'users'),
          where('uid', '==', data.patientId)
        ))
        if (!patientDoc.empty) {
          sessionsData.push({
            id: doc.id,
            patientId: data.patientId,
            patientName: patientDoc.docs[0].data().name,
            lastMessage: data.lastMessage,
            lastMessageTime: data.lastMessageTime,
            unreadCount: data.unreadCount || 0
          })
        }
      }
      setChatSessions(sessionsData)
    } catch (error) {
      console.error('Error fetching chat sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChatClick = (chatId: string) => {
    router.push(`/chat/${chatId}`)
  }

  const handleVideoCall = (patientId: string) => {
    router.push(`/video-call/${patientId}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Active Conversations</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading chats...</div>
        ) : chatSessions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No active conversations
          </div>
        ) : (
          <div className="space-y-4">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{session.patientName}</h3>
                  <p className="text-sm text-gray-500">{session.lastMessage}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(session.lastMessageTime).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleChatClick(session.id)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVideoCall(session.patientId)}
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 