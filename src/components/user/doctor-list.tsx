'use client'

import { useState, useEffect } from 'react'
import { db } from '@/app/Firebase/config'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { startChatWithDoctor } from '@/lib/utils/start-chat'
import { toast } from '@/hooks/use-toast'

export default function DoctorList() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Query only available doctors
    const q = query(
      collection(db, 'doctors'),
      where('isAvailable', '==', true),
      where('status', '==', 'available')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const doctorsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setDoctors(doctorsData)
      setLoading(false)
    }, (error) => {
      console.error('Error fetching doctors:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleStartChat = async (doctorId: string) => {
    try {
      // Get current user ID from your auth context
      const userId = auth.currentUser?.uid
      if (!userId) {
        toast({
          title: "Error",
          description: "Please sign in to chat with a doctor",
          variant: "destructive"
        })
        return
      }

      await startChatWithDoctor(userId, doctorId)
      // Navigate to chat or show success message
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to start chat",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return <div>Loading doctors...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {doctors.length > 0 ? (
        doctors.map(doctor => (
          <Card key={doctor.id} className="p-4">
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={doctor.avatar} />
                  <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium">{doctor.name}</h3>
                  <p className="text-sm text-gray-500">{doctor.specialty}</p>
                </div>
                <Badge
                  variant={doctor.status === 'available' ? 'success' : 'secondary'}
                >
                  {doctor.status}
                </Badge>
              </div>
              <Button 
                className="w-full"
                onClick={() => handleStartChat(doctor.id)}
                disabled={doctor.status !== 'available'}
              >
                Start Chat
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center py-8 text-gray-500">
          No doctors are currently available
        </div>
      )}
    </div>
  )
} 