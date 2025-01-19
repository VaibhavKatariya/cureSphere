'use client'

import { useEffect, useState } from 'react'
import { db } from '@/app/Firebase/config'
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Phone, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface NotificationItem {
  id: string
  type: 'call' | 'chat'
  from: {
    id: string
    name: string
  }
  status: string
  timestamp: Date
}

export default function NotificationsList({ doctorId }: { doctorId: string }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  useEffect(() => {
    // Listen for call notifications
    const callsUnsubscribe = onSnapshot(
      query(
        collection(db, 'calls'),
        where('to.id', '==', doctorId),
        orderBy('timestamp', 'desc'),
        limit(10)
      ),
      (snapshot) => {
        const calls = snapshot.docs.map(doc => ({
          id: doc.id,
          type: 'call' as const,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()
        }))
        setNotifications(prev => {
          const filtered = prev.filter(n => n.type !== 'call')
          return [...filtered, ...calls].sort((a, b) => b.timestamp - a.timestamp)
        })
      }
    )

    // Listen for chat notifications
    const chatsUnsubscribe = onSnapshot(
      query(
        collection(db, 'chatRequests'),
        where('to.id', '==', doctorId),
        orderBy('timestamp', 'desc'),
        limit(10)
      ),
      (snapshot) => {
        const chats = snapshot.docs.map(doc => ({
          id: doc.id,
          type: 'chat' as const,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()
        }))
        setNotifications(prev => {
          const filtered = prev.filter(n => n.type !== 'chat')
          return [...filtered, ...chats].sort((a, b) => b.timestamp - a.timestamp)
        })
      }
    )

    return () => {
      callsUnsubscribe()
      chatsUnsubscribe()
    }
  }, [doctorId])

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No notifications yet
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card key={notification.id} className="bg-white border-l-4 border-l-teal-500">
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
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{notification.from.name}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      notification.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      notification.status === 'declined' ? 'bg-red-100 text-red-800' :
                      notification.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <Clock className="h-4 w-4" />
                    {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 