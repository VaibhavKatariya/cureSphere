'use client'

import { useState, useEffect } from 'react'
import { db } from '@/app/Firebase/config'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface TimeSlot {
  start: string
  end: string
  available: boolean
}

interface DaySchedule {
  enabled: boolean
  timeSlots: TimeSlot[]
}

interface WeeklySchedule {
  [key: string]: DaySchedule
}

const defaultTimeSlots: TimeSlot[] = [
  { start: '09:00', end: '10:00', available: true },
  { start: '10:00', end: '11:00', available: true },
  { start: '11:00', end: '12:00', available: true },
  { start: '14:00', end: '15:00', available: true },
  { start: '15:00', end: '16:00', available: true },
  { start: '16:00', end: '17:00', available: true },
]

const defaultSchedule: WeeklySchedule = {
  monday: { enabled: true, timeSlots: [...defaultTimeSlots] },
  tuesday: { enabled: true, timeSlots: [...defaultTimeSlots] },
  wednesday: { enabled: true, timeSlots: [...defaultTimeSlots] },
  thursday: { enabled: true, timeSlots: [...defaultTimeSlots] },
  friday: { enabled: true, timeSlots: [...defaultTimeSlots] },
  saturday: { enabled: false, timeSlots: [...defaultTimeSlots] },
  sunday: { enabled: false, timeSlots: [...defaultTimeSlots] },
}

export default function DoctorSchedule({ doctorId }: { doctorId: string }) {
  const [schedule, setSchedule] = useState<WeeklySchedule>(defaultSchedule)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchedule()
  }, [])

  const fetchSchedule = async () => {
    try {
      const docRef = doc(db, 'doctors', doctorId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists() && docSnap.data().schedule) {
        setSchedule(docSnap.data().schedule)
      }
    } catch (error) {
      console.error('Error fetching schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSchedule = async () => {
    try {
      await updateDoc(doc(db, 'doctors', doctorId), {
        schedule
      })
    } catch (error) {
      console.error('Error saving schedule:', error)
    }
  }

  const toggleDayEnabled = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled
      }
    }))
  }

  const toggleTimeSlot = (day: string, index: number) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.map((slot, i) => 
          i === index ? { ...slot, available: !slot.available } : slot
        )
      }
    }))
  }

  if (loading) return <div>Loading schedule...</div>

  return (
    <div className="space-y-6">
      {Object.entries(schedule).map(([day, daySchedule]) => (
        <Card key={day}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium capitalize">{day}</CardTitle>
            <div className="flex items-center space-x-2">
              <Switch
                checked={daySchedule.enabled}
                onCheckedChange={() => toggleDayEnabled(day)}
              />
              <Label>Available</Label>
            </div>
          </CardHeader>
          <CardContent>
            {daySchedule.enabled && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {daySchedule.timeSlots.map((slot, index) => (
                  <Button
                    key={index}
                    variant={slot.available ? "default" : "outline"}
                    className={slot.available ? "bg-green-500 hover:bg-green-600" : ""}
                    onClick={() => toggleTimeSlot(day, index)}
                  >
                    {slot.start} - {slot.end}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      <Button 
        className="w-full"
        onClick={saveSchedule}
      >
        Save Schedule
      </Button>
    </div>
  )
} 