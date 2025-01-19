'use client'

import { useState, useEffect } from 'react'
import { db } from '@/app/Firebase/config'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { isDoctorAvailable } from '@/lib/utils/doctor-availability'

interface TimeSlot {
  start: string
  end: string
}

interface DaySchedule {
  isAvailable: boolean
  timeSlots: TimeSlot[]
}

interface WeekSchedule {
  [key: string]: DaySchedule
}

const defaultTimeSlot: TimeSlot = { start: '09:00', end: '17:00' }

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]

export default function DoctorSchedule({ doctorId }: { doctorId: string }) {
  const [schedule, setSchedule] = useState<WeekSchedule>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const docRef = doc(db, 'doctors', doctorId)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists() && docSnap.data().schedule) {
          setSchedule(docSnap.data().schedule)
        } else {
          // Initialize default schedule if none exists
          const defaultSchedule: WeekSchedule = {}
          daysOfWeek.forEach(day => {
            defaultSchedule[day] = {
              isAvailable: day !== 'Sunday',
              timeSlots: [{ ...defaultTimeSlot }]
            }
          })
          setSchedule(defaultSchedule)
        }
      } catch (error) {
        console.error('Error fetching schedule:', error)
        toast({
          title: "Error",
          description: "Failed to load schedule",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSchedule()
  }, [doctorId])

  const handleToggleDay = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isAvailable: !prev[day].isAvailable
      }
    }))
  }

  const handleAddTimeSlot = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: [...prev[day].timeSlots, { ...defaultTimeSlot }]
      }
    }))
  }

  const handleRemoveTimeSlot = (day: string, index: number) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.filter((_, i) => i !== index)
      }
    }))
  }

  const handleTimeChange = (day: string, index: number, field: 'start' | 'end', value: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.map((slot, i) => 
          i === index ? { ...slot, [field]: value } : slot
        )
      }
    }))
  }

  const saveSchedule = async () => {
    setSaving(true)
    try {
      const availability = isDoctorAvailable(schedule)
      await updateDoc(doc(db, 'doctors', doctorId), {
        schedule: schedule,
        status: availability.status,
        isAvailable: availability.isAvailable,
        lastStatusUpdate: serverTimestamp()
      })
      toast({
        title: "Success",
        description: "Schedule updated successfully",
      })
    } catch (error) {
      console.error('Error saving schedule:', error)
      toast({
        title: "Error",
        description: "Failed to save schedule",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>Loading schedule...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Weekly Schedule</h2>
        <Button 
          onClick={saveSchedule} 
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid gap-4">
        {daysOfWeek.map(day => (
          <Card key={day}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">{day}</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {schedule[day]?.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                  <Switch
                    checked={schedule[day]?.isAvailable}
                    onCheckedChange={() => handleToggleDay(day)}
                  />
                </div>
              </div>
            </CardHeader>
            {schedule[day]?.isAvailable && (
              <CardContent className="space-y-4">
                {schedule[day]?.timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-500">Start Time</label>
                        <Input
                          type="time"
                          value={slot.start}
                          onChange={(e) => handleTimeChange(day, index, 'start', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-500">End Time</label>
                        <Input
                          type="time"
                          value={slot.end}
                          onChange={(e) => handleTimeChange(day, index, 'end', e.target.value)}
                        />
                      </div>
                    </div>
                    {schedule[day].timeSlots.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTimeSlot(day, index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddTimeSlot(day)}
                >
                  Add Time Slot
                </Button>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

