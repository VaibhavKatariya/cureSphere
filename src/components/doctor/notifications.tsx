'use client'

import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '@/app/Firebase/config'
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  Timestamp, 
  updateDoc,
  doc,
  onSnapshot
} from 'firebase/firestore'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Phone, Video } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from "@/hooks/use-toast"

interface Notification {
  id: string
  type: string
  message: string
  read: boolean
  createdAt: Timestamp
  userId: string
  callId?: string
  chatId?: string
}

export default function DoctorNotifications() {
  const [user] = useAuthState(auth)
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [videoCallNotification, setVideoCallNotification] = useState<Notification | null>(null)

  useEffect(() => {
    let isSubscribed = true
    let unsubscribe: (() => void) | undefined

    const setupNotifications = async () => {
      if (!user?.uid) return

      try {
        const q = query(
          collection(db, 'notifications'),
          where('doctorId', '==', user.uid),
          where('read', '==', false),
          orderBy('createdAt', 'desc')
        )

        unsubscribe = onSnapshot(q, (snapshot) => {
          if (!isSubscribed) return

          const notifs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Notification[]
          
          setNotifications(notifs)

          // Show video call dialog for new call notifications
          const newCallNotif = notifs.find(n => n.type === 'call')
          if (newCallNotif) {
            console.log('New video call notification:', newCallNotif)
            setVideoCallNotification(newCallNotif)
          }

          // Show toast for other notifications
          const newNotif = notifs.find(n => n.type !== 'call')
          if (newNotif) {
            toast({
              title: "New Notification",
              description: newNotif.message,
            })
          }
        })
      } catch (error) {
        console.error('Error setting up notifications:', error)
      }
    }

    setupNotifications()

    return () => {
      isSubscribed = false
      if (unsubscribe) {
        try {
          unsubscribe()
        } catch (error) {
          console.error('Error unsubscribing:', error)
        }
      }
    }
  }, [user?.uid])

  const handleAcceptCall = async (notification: Notification) => {
    if (!user?.uid) return

    try {
      await updateDoc(doc(db, 'calls', notification.callId || notification.id), {
        status: 'accepted',
        acceptedAt: Timestamp.now()
      })

      await updateDoc(doc(db, 'notifications', notification.id), {
        read: true
      })

      setVideoCallNotification(null)
      router.push(`/consultation/${notification.userId}?call=true`)
    } catch (error) {
      console.error('Error accepting call:', error)
      toast({
        title: "Error",
        description: "Failed to accept call",
        variant: "destructive"
      })
    }
  }

  const handleDeclineCall = async (notification: Notification) => {
    if (!user?.uid) return

    try {
      await updateDoc(doc(db, 'calls', notification.callId || notification.id), {
        status: 'declined',
        declinedAt: Timestamp.now()
      })

      await updateDoc(doc(db, 'notifications', notification.id), {
        read: true
      })

      setVideoCallNotification(null)
      setNotifications(prev => prev.filter(n => n.id !== notification.id))
    } catch (error) {
      console.error('Error declining call:', error)
      toast({
        title: "Error",
        description: "Failed to decline call",
        variant: "destructive"
      })
    }
  }

  return (
    <>
      {/* Video Call Dialog */}
      <Dialog 
        open={!!videoCallNotification} 
        onOpenChange={() => setVideoCallNotification(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Incoming Video Call</DialogTitle>
            <DialogDescription>
              {videoCallNotification?.message}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => videoCallNotification && handleDeclineCall(videoCallNotification)}
              className="text-red-600 hover:text-red-700"
            >
              Decline
            </Button>
            <Button
              onClick={() => videoCallNotification && handleAcceptCall(videoCallNotification)}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Accept Call
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-4 w-80">
        {notifications
          .filter(notification => notification.type !== 'call')
          .map((notification) => (
            <Card key={notification.id} className="bg-white border-l-4 border-l-teal-500 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100 rounded-full">
                      <MessageSquare className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium">{notification.message}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </>
  )
}