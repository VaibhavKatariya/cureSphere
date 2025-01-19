'use client'

import { useState, useEffect, useRef } from 'react'
import { db, storage } from '@/app/Firebase/config'
import { collection, query, orderBy, limit, addDoc, serverTimestamp, doc, setDoc, Timestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Image as ImageIcon, Paperclip, X } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"

interface Message {
  id?: string
  text: string
  uid: string
  photoURL?: string
  createdAt: Timestamp
  senderName: string
  mediaUrl?: string
  mediaType?: 'image' | 'video'
}

interface ChatWindowProps {
  chatId: string
  currentUser: any
  otherUser: any
}

export default function ChatWindow({ chatId, currentUser, otherUser }: ChatWindowProps) {
  const [formValue, setFormValue] = useState('')
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dummy = useRef<HTMLDivElement>(null)
  
  // Create references for chat and messages
  const chatRef = doc(db, 'chats', chatId)
  const messagesRef = collection(chatRef, 'messages')
  
  // Query messages
  const q = query(messagesRef, orderBy('createdAt', 'asc'), limit(50))
  const [messages] = useCollectionData(q, { idField: 'id' })

  useEffect(() => {
    // Scroll to bottom whenever messages change
    dummy.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image or video file",
        variant: "destructive"
      })
      return
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive"
      })
      return
    }

    setMediaFile(file)
  }

  const uploadMedia = async (file: File) => {
    if (!file) throw new Error('No file provided')
    
    const fileExtension = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`
    
    const fileRef = ref(storage, `chats/${chatId}/media/${fileName}`)
    
    try {
      // Create a smaller chunk size for better upload handling
      const metadata = {
        contentType: file.type,
        customMetadata: {
          'uploadedBy': currentUser.uid,
          'chatId': chatId
        }
      }
    
      const snapshot = await uploadBytes(fileRef, file, metadata)
      const downloadUrl = await getDownloadURL(snapshot.ref)
      return downloadUrl
    } catch (error) {
      console.error('Error in uploadMedia:', error)
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload media",
        variant: "destructive"
      })
      throw error
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    const messageText = formValue.trim()
    if (!messageText && !mediaFile) return

    try {
      setIsUploading(true)
      let mediaUrl = ''
      let mediaType: 'image' | 'video' | undefined

      if (mediaFile) {
        try {
          console.log('Uploading media file:', mediaFile.name)
          mediaUrl = await uploadMedia(mediaFile)
          console.log('Media uploaded, URL:', mediaUrl)
          mediaType = mediaFile.type.startsWith('image/') ? 'image' : 'video'
        } catch (error) {
          console.error('Error uploading media:', error)
          toast({
            title: "Upload Failed",
            description: "Failed to upload media file",
            variant: "destructive"
          })
          return
        }
      }

      // Create or update chat document
      await setDoc(chatRef, {
        participants: [currentUser.uid, otherUser.id],
        lastMessage: messageText || (mediaType === 'image' ? 'Sent an image' : 'Sent a video'),
        lastMessageTime: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      }, { merge: true })

      // Add message
      const messageData = {
        text: messageText,
        createdAt: serverTimestamp(),
        uid: currentUser.uid,
        senderName: currentUser.displayName || 'User',
        photoURL: currentUser.photoURL || '/placeholder.svg',
        ...(mediaUrl ? { mediaUrl, mediaType } : {})
      }

      console.log('Sending message with data:', messageData)
      await addDoc(messagesRef, messageData)

      // Clear input and scroll
      setFormValue('')
      setMediaFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      dummy.current?.scrollIntoView({ behavior: 'smooth' })
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
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
          {messages?.map((msg: Message) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${
                msg.uid === currentUser.uid ? 'flex-row-reverse' : ''
              }`}
            >
              <Avatar>
                <AvatarImage src={msg.photoURL} />
                <AvatarFallback>
                  {msg.senderName?.charAt(0) ?? ''}
                </AvatarFallback>
              </Avatar>
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.uid === currentUser.uid
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                {msg.mediaUrl && msg.mediaType === 'image' && (
                  <img 
                    src={msg.mediaUrl} 
                    alt="Shared image"
                    className="rounded-lg mb-2 max-w-full cursor-pointer hover:opacity-90"
                    onClick={() => window.open(msg.mediaUrl, '_blank')}
                  />
                )}
                {msg.mediaUrl && msg.mediaType === 'video' && (
                  <video 
                    src={msg.mediaUrl} 
                    controls
                    className="rounded-lg mb-2 max-w-full"
                  />
                )}
                {msg.text && <p>{msg.text}</p>}
                {msg.createdAt && (
                  <p className="text-xs mt-1 opacity-70">
                    {msg.createdAt.toDate().toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
          <div ref={dummy} />
        </CardContent>
      </ScrollArea>
      <div className="p-4 border-t">
        {mediaFile && (
          <div className="mb-2 p-2 bg-gray-100 rounded-lg flex items-center justify-between">
            <span className="text-sm truncate">{mediaFile.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMediaFile(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            ref={fileInputRef}
            onClick={(e) => {
              // Reset file input value to allow selecting the same file again
              (e.target as HTMLInputElement).value = ''
            }}
            onChange={handleFileSelect}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <span className="animate-spin">⌛</span>
            ) : (
              <Paperclip className="h-4 w-4" />
            )}
          </Button>
          <Input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Type a message..."
            disabled={isUploading}
          />
          <Button 
            type="submit" 
            disabled={isUploading || (!formValue.trim() && !mediaFile)}
          >
            {isUploading ? (
              <span className="animate-spin">⌛</span>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </Card>
  )
} 