'use client'

import { useState, useEffect } from 'react'
import { db } from '@/app/Firebase/config'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, MessageSquare, Calendar } from 'lucide-react'

interface Patient {
  id: string
  name: string
  avatar: string
  lastVisit: Date
  condition: string
  status: 'active' | 'pending' | 'completed'
  appointmentsCount: number
  age: number
  gender: string
}

export default function DoctorPatients({ doctorId }: { doctorId: string }) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Get all appointments for this doctor
        const appointmentsQuery = query(
          collection(db, 'appointments'),
          where('doctorId', '==', doctorId),
          orderBy('scheduledAt', 'desc')
        )
        
        const appointmentsSnap = await getDocs(appointmentsQuery)
        const patientIds = new Set(appointmentsSnap.docs.map(doc => doc.data().userId))
        
        // Get patient details
        const patientsData: Patient[] = []
        for (const patientId of patientIds) {
          const userDoc = await getDocs(doc(db, 'users', patientId))
          const userData = userDoc.data()
          
          if (userData) {
            const patientAppointments = appointmentsSnap.docs.filter(
              doc => doc.data().userId === patientId
            )
            
            patientsData.push({
              id: patientId,
              name: userData.name || 'Anonymous',
              avatar: userData.avatar || '/placeholder.svg',
              lastVisit: patientAppointments[0]?.data().scheduledAt.toDate(),
              condition: patientAppointments[0]?.data().condition || 'N/A',
              status: patientAppointments[0]?.data().status || 'completed',
              appointmentsCount: patientAppointments.length,
              age: userData.age || 'N/A',
              gender: userData.gender || 'N/A'
            })
          }
        }
        
        setPatients(patientsData)
      } catch (error) {
        console.error('Error fetching patients:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [doctorId])

  if (loading) {
    return <div>Loading patients...</div>
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Patients List */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Patients ({patients.length})</CardTitle>
        </CardHeader>
        <ScrollArea className="h-[600px]">
          <CardContent className="space-y-4">
            {patients.map(patient => (
              <div
                key={patient.id}
                className={`p-4 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  selectedPatient?.id === patient.id ? 'bg-teal-50 border-l-4 border-teal-500' : ''
                }`}
                onClick={() => setSelectedPatient(patient)}
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={patient.avatar} />
                    <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{patient.name}</p>
                    <p className="text-sm text-gray-500">
                      Last visit: {patient.lastVisit.toLocaleDateString()}
                    </p>
                  </div>
                  <Badge>{patient.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </ScrollArea>
      </Card>

      {/* Patient Details */}
      <Card className="col-span-2">
        {selectedPatient ? (
          <div>
            <CardHeader className="border-b">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedPatient.avatar} />
                  <AvatarFallback>{selectedPatient.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{selectedPatient.name}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {selectedPatient.age} years • {selectedPatient.gender}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="appointments">
                    <Calendar className="w-4 h-4 mr-2" />
                    Appointments
                  </TabsTrigger>
                  <TabsTrigger value="prescriptions">
                    <FileText className="w-4 h-4 mr-2" />
                    Prescriptions
                  </TabsTrigger>
                  <TabsTrigger value="chat">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-500">Total Appointments</p>
                        <p className="text-2xl font-bold">{selectedPatient.appointmentsCount}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-500">Current Condition</p>
                        <p className="text-2xl font-bold">{selectedPatient.condition}</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="appointments">
                  {/* Appointments history would go here */}
                  <p className="text-gray-500 text-center py-4">Appointments history</p>
                </TabsContent>

                <TabsContent value="prescriptions">
                  {/* Prescriptions history would go here */}
                  <p className="text-gray-500 text-center py-4">Prescriptions history</p>
                </TabsContent>

                <TabsContent value="chat">
                  {/* Chat interface would go here */}
                  <p className="text-gray-500 text-center py-4">Chat history</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </div>
        ) : (
          <div className="h-[600px] flex items-center justify-center text-gray-500">
            Select a patient to view details
          </div>
        )}
      </Card>
    </div>
  )
} 