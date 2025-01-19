'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { X } from 'lucide-react'

interface NotificationMessage {
  id: string
  title: string
  message: string
  type: 'success' | 'error' | 'info'
}

export const notifyEvent = new EventTarget()

export const notify = (notification: Omit<NotificationMessage, 'id'>) => {
  const event = new CustomEvent('notification', {
    detail: {
      ...notification,
      id: Math.random().toString(36).substr(2, 9)
    }
  })
  notifyEvent.dispatchEvent(event)
}

export default function Notification() {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([])

  useEffect(() => {
    const handleNotification = (event: any) => {
      setNotifications(prev => [...prev, event.detail])
      // Auto remove after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== event.detail.id))
      }, 5000)
    }

    notifyEvent.addEventListener('notification', handleNotification)
    return () => notifyEvent.removeEventListener('notification', handleNotification)
  }, [])

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Card 
          key={notification.id} 
          className={`
            w-80 shadow-lg border-l-4 
            ${notification.type === 'error' ? 'border-l-red-500' : ''}
            ${notification.type === 'success' ? 'border-l-green-500' : ''}
            ${notification.type === 'info' ? 'border-l-blue-500' : ''}
          `}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{notification.title}</h4>
                <p className="text-sm text-gray-600">{notification.message}</p>
              </div>
              <button 
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 