'use client'

import { useState, useEffect } from 'react'
import { db } from '@/app/Firebase/config'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

interface Patient {
  id: string
  name: string
  age: string
  lastVisit?: string
  upcomingAppointment?: string
  medicalHistory?: string[]
}

export default function DoctorPatients({ doctorId }: { doctorId: string }) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      // Get appointments for this doctor
      const appointmentsQuery = query(
        collection(db, 'appointments'),
        where('doctorId', '==', doctorId)
      )
      const appointmentsSnapshot = await getDocs(appointmentsQuery)
      
      // Get unique patient IDs
      const patientIds = new Set<string>()
      appointmentsSnapshot.forEach((doc) => {
        patientIds.add(doc.data().patientId)
      })

      // Fetch patient details
      const patientsData: Patient[] = []
      for (const patientId of Array.from(patientIds)) {
        const patientDoc = await getDocs(query(
          collection(db, 'users'),
          where('uid', '==', patientId)
        ))
        if (!patientDoc.empty) {
          const patientData = patientDoc.docs[0].data()
          patientsData.push({
            id: patientId,
            name: patientData.name,
            age: patientData.age,
            // Add more patient details as needed
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

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">My Patients</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search patients..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading patients...</div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No patients found
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{patient.name}</h3>
                  <p className="text-sm text-gray-500">Age: {patient.age}</p>
                  {patient.lastVisit && (
                    <p className="text-sm text-gray-500">
                      Last visit: {patient.lastVisit}
                    </p>
                  )}
                </div>
                {patient.upcomingAppointment && (
                  <div className="text-sm text-blue-600">
                    Next: {patient.upcomingAppointment}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 