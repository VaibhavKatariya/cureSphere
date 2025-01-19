'use client'

import { useState, useEffect } from 'react'
import { db } from '@/app/Firebase/config'
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Check, X, Video, MessageSquare } from 'lucide-react'

interface Appointment {
  id: string
  patientName: string
  patientId: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'cancelled'
  type: 'video' | 'chat'
  symptoms: string
}

export default function DoctorAppointments({ doctorId }: { doctorId: string }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [selectedDate])

  const fetchAppointments = async () => {
    try {
      const q = query(
        collection(db, 'appointments'),
        where('doctorId', '==', doctorId),
        where('date', '==', selectedDate.toISOString().split('T')[0])
      )
      const querySnapshot = await getDocs(q)
      const appointmentsData: Appointment[] = []
      querySnapshot.forEach((doc) => {
        appointmentsData.push({ id: doc.id, ...doc.data() } as Appointment)
      })
      setAppointments(appointmentsData.sort((a, b) => a.time.localeCompare(b.time)))
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateAppointmentStatus = async (appointmentId: string, status: 'confirmed' | 'cancelled') => {
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), { status })
      fetchAppointments() // Refresh the list
    } catch (error) {
      console.error('Error updating appointment:', error)
    }
  }

  return (
    <div className="grid md:grid-cols-[300px,1fr] gap-6">
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-teal-800">Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border border-teal-200"
          />
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-teal-800">
            Appointments for {selectedDate.toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-teal-600 py-8">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="text-center text-teal-600 py-8">
              No appointments scheduled for this date
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border border-teal-100 rounded-lg hover:bg-teal-50 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-teal-800">{appointment.patientName}</h3>
                    <p className="text-sm text-teal-600">
                      {appointment.time} - {appointment.type === 'video' ? <Video className="inline w-4 h-4" /> : <MessageSquare className="inline w-4 h-4" />} consultation
                    </p>
                    <p className="text-sm text-teal-700 mt-1">
                      Symptoms: {appointment.symptoms}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        appointment.status === 'confirmed'
                          ? 'success'
                          : appointment.status === 'cancelled'
                          ? 'destructive'
                          : 'secondary'
                      }
                      className="capitalize"
                    >
                      {appointment.status}
                    </Badge>
                    {appointment.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
