'use client'

import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '@/app/Firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Users, MessageSquare, Video, Settings } from 'lucide-react'
import DoctorAppointments from '@/components/doctor/appointments'
import DoctorSchedule from '@/components/doctor/schedule'
// import DoctorPatients from '@/components/doctor/patients'
// import DoctorChats from '@/components/doctor/chats'
// import DoctorSettings from '@/components/doctor/settings'

export default function DoctorDashboard() {
  const [user] = useAuthState(auth)
  const [doctorData, setDoctorData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!user) return

      try {
        const docRef = doc(db, 'doctors', user.uid)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          setDoctorData(docSnap.data())
        }
      } catch (error) {
        console.error('Error fetching doctor data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctorData()
  }, [user])

  if (!user) {
    router.push('/doctor/signin')
    return null
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        {/* Doctor Info Card */}
        <Card className="mb-6">
          <CardContent className="flex items-center gap-4 p-4">
            <img
              src={doctorData?.avatar || '/placeholder.svg'}
              alt={doctorData?.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold">{doctorData?.name}</h1>
              <p className="text-gray-600">{doctorData?.specialty}</p>
            </div>
            <div className="ml-auto">
              <Button
                variant="outline"
                onClick={() => auth.signOut()}
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="appointments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Patients
            </TabsTrigger>
            <TabsTrigger value="chats" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chats
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <DoctorAppointments doctorId={user.uid} />
          </TabsContent>

          <TabsContent value="schedule">
            <DoctorSchedule doctorId={user.uid} />
          </TabsContent>

          {/* <TabsContent value="patients">
            <DoctorPatients doctorId={user.uid} />
          </TabsContent>

          <TabsContent value="chats">
            <DoctorChats doctorId={user.uid} />
          </TabsContent>

          <TabsContent value="settings">
            <DoctorSettings doctorData={doctorData} doctorId={user.uid} />
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  )
} 