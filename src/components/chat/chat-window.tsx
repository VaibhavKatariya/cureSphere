'use client'

import { useState, useEffect, useRef } from 'react'
import { db } from '@/app/Firebase/config'
import { collection, query, orderBy, limit, addDoc, serverTimestamp, updateDoc, doc, increment, setDoc } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  text: string
  uid: string
  photoURL: string
  createdAt: Date
  senderName: string
  read: boolean
}

interface ChatWindowProps {
  chatId: string
  currentUser: any
  otherUser: any
}

export default function ChatWindow({ chatId, currentUser, otherUser }: ChatWindowProps) {
  const [formValue, setFormValue] = useState('')
  const dummy = useRef<HTMLDivElement>(null)
  
  const messagesRef = collection(db, 'chats', chatId, 'messages')
  const q = query(messagesRef, orderBy('createdAt'), limit(50))
  const [messages] = useCollectionData(q, { idField: 'id' })

  // Mark messages as read
  useEffect(() => {
    if (!messages || !messages.length) return
    
    const unreadMessages = messages.filter(
      msg => msg.uid === otherUser.id && !msg.read
    )
    
    const markAsRead = async () => {
      for (const msg of unreadMessages) {
        if (!msg.id) continue
        await updateDoc(doc(db, 'chats', chatId, 'messages', msg.id), {
          read: true
        })
      }
    }
    
    if (unreadMessages.length > 0) {
      markAsRead()
    }
  }, [messages, otherUser.id, chatId])

  const scrollToBottom = () => {
    dummy.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formValue.trim()) return

    try {
      // First, ensure the chat document exists
      const chatRef = doc(db, 'chats', chatId)
      await setDoc(chatRef, {
        participants: [currentUser.id, otherUser.id],
        participantDetails: {
          [currentUser.id]: {
            name: currentUser.name || currentUser.displayName,
            avatar: currentUser.avatar || currentUser.photoURL || '/placeholder.svg',
            role: currentUser.role
          },
          [otherUser.id]: {
            name: otherUser.name,
            avatar: otherUser.avatar || '/placeholder.svg',
            role: otherUser.role
          }
        },
        lastMessage: formValue,
        lastMessageTime: serverTimestamp(),
        [`${otherUser.id}UnreadCount`]: increment(1)
      }, { merge: true })

      // Then add the message
      await addDoc(messagesRef, {
        text: formValue,
        createdAt: serverTimestamp(),
        uid: currentUser.id,
        photoURL: currentUser.avatar || currentUser.photoURL || '/placeholder.svg',
        senderName: currentUser.name || currentUser.displayName,
        read: false
      })

      setFormValue('')
      scrollToBottom()
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="text-lg font-medium">
          Chat with {otherUser.name}
        </CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent className="p-4 space-y-4">
          {messages?.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 ${
                msg.uid === currentUser.id ? 'flex-row-reverse' : ''
              }`}
            >
              <Avatar>
                <AvatarImage src={msg.photoURL} />
                <AvatarFallback>
                  {msg.senderName?.split(' ').map((n) => n[0]).join('') ?? ''}
                </AvatarFallback>
              </Avatar>
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.uid === currentUser.id
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={dummy}></div>
        </CardContent>
      </ScrollArea>
      <div className="p-4 border-t">
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Type a message..."
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
} 