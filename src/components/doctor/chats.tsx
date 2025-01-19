'use client'

import { useState, useEffect } from 'react'
import { db } from '@/app/Firebase/config'
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore'
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!doctorId) return

    const activeChatsQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', doctorId),
      orderBy('createdAt', 'desc')
    )

    // Subscribe to active chats
    const chatsUnsubscribe = onSnapshot(activeChatsQuery, async (snapshot) => {
      try {
        console.log('Got chat snapshot:', snapshot.docs.length, 'chats')
        const chatData: Chat[] = []

        for (const docSnapshot of snapshot.docs) {
          const data = docSnapshot.data()
          console.log('Processing chat:', docSnapshot.id, data)
          
          const otherUserId = data.participants?.find((id: string) => id !== doctorId)
          if (!otherUserId) continue

          try {
            const userDocRef = doc(db, 'users', otherUserId)
            const userDocSnap = await getDoc(userDocRef)
            const userData = userDocSnap.data()
            console.log('Got user data:', otherUserId, userData)

            if (userData) {
              chatData.push({
                id: docSnapshot.id,
                userId: otherUserId,
                userName: userData.displayName || userData.name || 'User',
                userAvatar: userData.photoURL || userData.avatar || '/placeholder.svg',
                lastMessage: data.lastMessage || 'New conversation',
                lastMessageTime: data.createdAt?.toDate() || new Date(),
                unreadCount: data[`${doctorId}UnreadCount`] || 0
              })
            }
          } catch (error) {
            console.error('Error fetching user data for:', otherUserId, error)
          }
        }

        setChats(chatData)
        setLoading(false)
      } catch (error) {
        console.error('Error processing chat data:', error)
        setLoading(false)
      }
    })

    return () => {
      chatsUnsubscribe()
    }
  }, [doctorId])

  return (
    <div className="grid grid-cols-3 gap-4 h-[600px]">
      {/* Chat List */}
      <Card className="col-span-1">
        <ScrollArea className="h-[600px]">
          <CardContent className="p-4 space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading chats...
              </div>
            ) : chats.length > 0 ? (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors
                    ${selectedChat?.id === chat.id ? 'bg-teal-50 border-l-4 border-teal-500' : ''}`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <Avatar>
                    <AvatarImage src={chat.userAvatar} alt={chat.userName} />
                    <AvatarFallback>
                      {chat.userName.charAt(0)}
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
              ))
            ) : (
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
            currentUser={{ 
              uid: doctorId,
              role: 'doctor',
              displayName: 'Doctor',
              photoURL: '/placeholder.svg'
            }}
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