'use client'

import { useState, useEffect } from 'react'
import { db } from '@/app/Firebase/config'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function DoctorList() {
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    const fetchDoctors = async () => {
      const q = query(
        collection(db, 'doctors'),
        where('isAvailable', '==', true)
      )
      
      const querySnapshot = await getDocs(q)
      const doctorsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setDoctors(doctorsData)
    }

    fetchDoctors()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {doctors.map(doctor => (
        <Card key={doctor.id} className="p-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={doctor.avatar} />
              <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{doctor.name}</h3>
              <p className="text-sm text-gray-500">{doctor.specialty}</p>
            </div>
            <Badge
              variant={
                doctor.status === 'available' 
                  ? 'success' 
                  : doctor.status === 'busy' 
                  ? 'warning' 
                  : 'secondary'
              }
              className="ml-auto"
            >
              {doctor.status}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  )
} 