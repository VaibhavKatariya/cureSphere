'use client'

import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '@/app/Firebase/config'
import { collection, query, where, onSnapshot, doc, updateDoc, Timestamp } from 'firebase/firestore'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface NotificationItem {
  id: string
  type: 'call' | 'chat'
  from: {
    id: string
    name: string
  }
  timestamp: Date
}

export default function DoctorNotifications() {
  const [user] = useAuthState(auth)
  const router = useRouter()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  useEffect(() => {
    if (!user) return
    const cleanupFunctions: Array<() => void> = []

    // Listen for call requests
    const callsUnsubscribe = onSnapshot(
      query(
        collection(db, 'calls'),
        where('to.id', '==', user.uid),
        where('status', '==', 'requesting')
      ),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data()
            // Play notification sound
            const audio = new Audio('/notification.mp3')
            audio.play()
            
            setNotifications(prev => [...prev, {
              id: change.doc.id,
              type: 'call',
              from: data.from,
              timestamp: data.timestamp?.toDate() || new Date()
            }])

            // Auto-remove after 1 minute
            setTimeout(() => {
              setNotifications(prev => prev.filter(n => n.id !== change.doc.id))
            }, 60000)
          }
          if (change.type === 'modified' || change.type === 'removed') {
            setNotifications(prev => prev.filter(n => n.id !== change.doc.id))
          }
        })
      }
    )
    cleanupFunctions.push(callsUnsubscribe)

    // Listen for chat requests
    const chatsUnsubscribe = onSnapshot(
      query(
        collection(db, 'chatRequests'),
        where('to.id', '==', user.uid),
        where('status', '==', 'pending')
      ),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data()
            // Play notification sound
            const audio = new Audio('/notification.mp3')
            audio.play()
            
            setNotifications(prev => [...prev, {
              id: change.doc.id,
              type: 'chat',
              from: data.from,
              timestamp: data.timestamp?.toDate() || new Date()
            }])

            // Auto-remove after 1 minute
            setTimeout(() => {
              setNotifications(prev => prev.filter(n => n.id !== change.doc.id))
            }, 60000)
          }
          if (change.type === 'modified' || change.type === 'removed') {
            setNotifications(prev => prev.filter(n => n.id !== change.doc.id))
          }
        })
      }
    )
    cleanupFunctions.push(chatsUnsubscribe)

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup())
    }
  }, [user])

  const handleAcceptCall = async (callId: string, userId: string) => {
    try {
      await updateDoc(doc(db, 'calls', callId), {
        status: 'accepted',
        acceptedAt: Timestamp.now()
      })
      router.push(`/consultation/${userId}?call=true`)
    } catch (error) {
      console.error('Error accepting call:', error)
    }
  }

  const handleDeclineCall = async (callId: string) => {
    try {
      await updateDoc(doc(db, 'calls', callId), {
        status: 'declined',
        declinedAt: Timestamp.now()
      })
      setNotifications(prev => prev.filter(n => n.id !== callId))
    } catch (error) {
      console.error('Error declining call:', error)
    }
  }

  const handleAcceptChat = async (chatId: string, userId: string) => {
    try {
      await updateDoc(doc(db, 'chatRequests', chatId), {
        status: 'accepted',
        acceptedAt: Timestamp.now()
      })
      router.push(`/consultation/${userId}`)
    } catch (error) {
      console.error('Error accepting chat:', error)
    }
  }

  const handleDeclineChat = async (chatId: string) => {
    try {
      await updateDoc(doc(db, 'chatRequests', chatId), {
        status: 'declined',
        declinedAt: Timestamp.now()
      })
      setNotifications(prev => prev.filter(n => n.id !== chatId))
    } catch (error) {
      console.error('Error declining chat:', error)
    }
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4 w-80">
      {notifications.map((notification) => (
        <Card key={notification.id} className="bg-white border-l-4 border-l-teal-500 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-full">
                  {notification.type === 'call' ? (
                    <Phone className="h-5 w-5 text-teal-600" />
                  ) : (
                    <MessageSquare className="h-5 w-5 text-teal-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{notification.from.name}</p>
                  <p className="text-sm text-gray-500">
                    {notification.type === 'call' ? 'Video Call Request' : 'Chat Request'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => 
                  notification.type === 'call' 
                    ? handleDeclineCall(notification.id)
                    : handleDeclineChat(notification.id)
                }
                className="flex-1 text-red-600 hover:text-red-700"
              >
                Decline
              </Button>
              <Button
                size="sm"
                onClick={() => 
                  notification.type === 'call'
                    ? handleAcceptCall(notification.id, notification.from.id)
                    : handleAcceptChat(notification.id, notification.from.id)
                }
                className="flex-1 bg-teal-600 hover:bg-teal-700"
              >
                Accept
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 