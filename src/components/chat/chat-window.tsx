'use client'

import { useState, useEffect, useRef } from 'react'
import { db } from '@/app/Firebase/config'
import { collection, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from 'lucide-react'

interface Message {
  text: string
  uid: string
  photoURL: string
  createdAt: Date
  senderName: string
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
  const q = query(messagesRef, orderBy('createdAt'), limit(25))
  const [messages] = useCollectionData(q)

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
      await addDoc(messagesRef, {
        text: formValue,
        createdAt: serverTimestamp(),
        uid: currentUser.uid,
        photoURL: currentUser.photoURL || '/placeholder.svg',
        senderName: currentUser.displayName
      })

      setFormValue('')
      scrollToBottom()
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Chat with {otherUser.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.uid === currentUser.uid ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.uid === currentUser.uid
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <p className="text-xs opacity-70 mb-1">{msg.senderName}</p>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={dummy}></div>
      </CardContent>
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