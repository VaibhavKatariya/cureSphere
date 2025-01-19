'use client'

import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '@/app/Firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Users, MessageSquare, Settings, LogOut, FileText, Bell } from 'lucide-react'
import DoctorAppointments from '@/components/doctor/appointments'
import DoctorSchedule from '@/components/doctor/schedule'
import Prescription from '@/components/doctor/prescription'
import DoctorNotifications from '@/components/doctor/notifications'
import NotificationsList from  "@/components/doctor/notifications-list"
import DoctorPatients from '@/components/doctor/patients'
import DoctorChats from '@/components/doctor/chats'
import DoctorSettings from '@/components/doctor/settings'

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
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorNotifications />
      <div className="container mx-auto p-4">
        {/* Doctor Info Card */}
        <Card className="mb-6 bg-white shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <img
              src={doctorData?.avatar || '/placeholder.svg'}
              alt={doctorData?.name}
              className="w-16 h-16 rounded-full border-2 border-teal-500"
            />
            <div>
              <h1 className="text-2xl font-bold text-teal-800">{doctorData?.name}</h1>
              <p className="text-teal-600">{doctorData?.specialty}</p>
            </div>
            <Button
              variant="outline"
              className="ml-auto text-teal-600 hover:text-teal-700 hover:bg-teal-50"
              onClick={() => auth.signOut()}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="appointments" className="space-y-4">
          <TabsList className="bg-white shadow-sm rounded-lg p-1">
            <TabsTrigger value="appointments" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800">
              <Calendar className="w-4 h-4 mr-2" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800">
              <Clock className="w-4 h-4 mr-2" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="patients" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800">
              <Users className="w-4 h-4 mr-2" />
              Patients
            </TabsTrigger>
            <TabsTrigger value="chats" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chats
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="prescription" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800">
              <FileText className="w-4 h-4 mr-2" />
              Prescription
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <DoctorAppointments doctorId={user.uid} />
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-teal-800">
                  Recent Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NotificationsList doctorId={user.uid} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <DoctorSchedule doctorId={user.uid} />
          </TabsContent>

          <TabsContent value="prescription">
            <Prescription />
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
