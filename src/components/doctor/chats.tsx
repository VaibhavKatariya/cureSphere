'use client'

import { useState, useEffect } from 'react'
import { db } from '@/app/Firebase/config'
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import ChatWindow from '@/components/chat/chat-window'
import { formatDistanceToNow } from 'date-fns'

interface Chat {
  id: string
  participants: string[]
  participantDetails: {
    [key: string]: {
      name: string
      avatar: string
      role: string
    }
  }
  lastMessage?: string
  updatedAt?: Timestamp
  createdAt?: Timestamp
  [key: string]: any
}

export default function DoctorChats({ doctorId }: { doctorId: string }) {
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!doctorId) return
    
    console.log('Setting up chat listener for doctor:', doctorId)
    
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', doctorId)
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log('Chat snapshot received:', snapshot.docs.length, 'chats')
        
        const chatList = snapshot.docs
          .map(doc => {
            const data = doc.data()
            return {
              id: doc.id,
              ...data,
              lastMessageTime: data.updatedAt?.toDate() || data.createdAt?.toDate()
            }
          })
          .sort((a, b) => {
            const timeA = a.updatedAt?.toMillis() || a.createdAt?.toMillis() || 0
            const timeB = b.updatedAt?.toMillis() || b.createdAt?.toMillis() || 0
            return timeB - timeA
          }) as Chat[]

        console.log('Processed chats:', chatList)
        setChats(chatList)
        setLoading(false)
      },
      (error) => {
        console.error('Error in chat subscription:', error)
        toast({
          title: "Error",
          description: "Failed to load chats",
          variant: "destructive"
        })
        setLoading(false)
      }
    )

    return () => {
      console.log('Cleaning up chat subscription')
      unsubscribe()
    }
  }, [doctorId])

  const getOtherParticipant = (chat: Chat) => {
    const otherParticipantId = chat.participants.find(p => p !== doctorId)
    return otherParticipantId ? chat.participantDetails[otherParticipantId] : null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        Loading chats...
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-4 h-[600px]">
      {/* Chat List */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Conversations
            <Badge variant="secondary">{chats.length}</Badge>
          </CardTitle>
        </CardHeader>
        <ScrollArea className="h-[500px]">
          <CardContent className="space-y-4">
            {chats.map(chat => {
              const otherParticipant = getOtherParticipant(chat)
              if (!otherParticipant) return null

              return (
                <div
                  key={chat.id}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedChat?.id === chat.id 
                      ? 'bg-teal-50 border-l-4 border-teal-500' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={otherParticipant.avatar} />
                      <AvatarFallback>{otherParticipant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{otherParticipant.name}</p>
                        {chat.lastMessageTime && (
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(chat.lastMessageTime, { addSuffix: true })}
                          </span>
                        )}
                      </div>
                      {chat.lastMessage && (
                        <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                      )}
                      {chat[`${doctorId}UnreadCount`] > 0 && (
                        <Badge variant="secondary" className="mt-1">
                          {chat[`${doctorId}UnreadCount`]} new
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            {chats.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No conversations yet
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
            currentUser={{ 
              uid: doctorId,
              role: 'doctor',
              ...selectedChat.participantDetails[doctorId]
            }}
            otherUser={{
              id: selectedChat.participants.find(p => p !== doctorId) || '',
              ...getOtherParticipant(selectedChat)
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </Card>
    </div>
  )
} 