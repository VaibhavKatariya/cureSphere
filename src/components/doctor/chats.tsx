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
  userId: string
  userName: string
  userAvatar: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
}

export default function DoctorChats({ doctorId }: { doctorId: string }) {
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)

  useEffect(() => {
    // Listen for active chats
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'chats'),
        where('participants', 'array-contains', doctorId),
        orderBy('lastMessageTime', 'desc')
      ),
      (snapshot) => {
        const chatData = snapshot.docs.map(doc => {
          const data = doc.data()
          const otherParticipantId = data.participants.find((id: string) => id !== doctorId)
          const otherParticipant = data.participantDetails[otherParticipantId]
          
          return {
            id: doc.id,
            userId: otherParticipantId,
            userName: otherParticipant.name,
            userAvatar: otherParticipant.avatar,
            lastMessage: data.lastMessage || '',
            lastMessageTime: data.lastMessageTime?.toDate() || new Date(),
            unreadCount: data[`${doctorId}UnreadCount`] || 0
          }
        })
        setChats(chatData)
      }
    )

    return () => unsubscribe()
  }, [doctorId])

  return (
    <div className="grid grid-cols-3 gap-4 h-[600px]">
      {/* Chat List */}
      <Card className="col-span-1">
        <ScrollArea className="h-[600px]">
          <CardContent className="p-4 space-y-4">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors
                  ${selectedChat?.id === chat.id ? 'bg-teal-50 border-l-4 border-teal-500' : ''}`}
                onClick={() => setSelectedChat(chat)}
              >
                <Avatar>
                  <AvatarImage src={chat.userAvatar} alt={chat.userName} />
                  <AvatarFallback>
                    {chat.userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{chat.userName}</p>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(chat.lastMessageTime, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                </div>
                {chat.unreadCount > 0 && (
                  <span className="bg-teal-500 text-white text-xs px-2 py-1 rounded-full">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            ))}
            {chats.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No active chats
              </div>
            )}
          </CardContent>
        </ScrollArea>
      </Card>

      {/* Chat Window */}
      <Card className="col-span-2">
        {selectedChat ? (
          <ChatWindow
            chatId={selectedChat.id}
            currentUser={{ id: doctorId, role: 'doctor' }}
            otherUser={{
              id: selectedChat.userId,
              name: selectedChat.userName,
              avatar: selectedChat.userAvatar
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </Card>
    </div>
  )
} 