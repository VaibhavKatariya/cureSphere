'use client'

import { useState, useEffect } from 'react'
import { db } from '@/app/Firebase/config'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from 'date-fns'
import ChatWindow from '@/components/chat/chat-window'

interface Chat {
  id: string
  doctorId: string
  doctorName: string
  doctorAvatar: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
}

export default function UserChats({ userId }: { userId: string }) {
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'chats'),
        where('participants', 'array-contains', userId),
        orderBy('lastMessageTime', 'desc')
      ),
      (snapshot) => {
        const chatData = snapshot.docs.map(doc => {
          const data = doc.data()
          const doctorId = data.participants.find((id: string) => id !== userId)
          const doctor = data.participantDetails[doctorId]
          
          return {
            id: doc.id,
            doctorId,
            doctorName: doctor.name,
            doctorAvatar: doctor.avatar,
            lastMessage: data.lastMessage || '',
            lastMessageTime: data.lastMessageTime?.toDate() || new Date(),
            unreadCount: data[`${userId}UnreadCount`] || 0
          }
        })
        setChats(chatData)
      }
    )

    return () => unsubscribe()
  }, [userId])

  // Rest of the component is similar to DoctorChats
  // Just change the user/doctor references accordingly
} 