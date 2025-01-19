'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { VideoIcon, MessageSquare, Star, Clock, Globe, DollarSign, GraduationCap } from 'lucide-react'

import { getFirestore, doc } from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore'; // Hook from react-firebase-hooks
const db = getFirestore(); // Initialize Firestore

export default function DoctorProfile() {
  const params = useParams();
  const [doctor, setDoctor] = useState(null);

  // Fetching the document using useDocument hook
  const [value, loading, error] = useDocument(doc(db, 'doctors', params.id));

  useEffect(() => {
    if (value && value.exists()) {
      setDoctor(value.data()); // Set the doctor data from Firestore
    }
  }, [value]);

  const handleChat = () => {
    if (doctor) {
      window.location.href = `/chat/${doctor.id}`;
    }
  };

  const handleVideoCall = () => {
    if (doctor) {
      window.location.href = `/video-call/${doctor.id}`;
    }
  };

  if (loading) {
    return <div>Loading...</div>; // You can customize this loading UI
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Handle any errors
  }

  if (!doctor) {
    return <div>Doctor not found</div>; // Handle case when doctor data isn't available
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-teal-500 text-white p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-32 h-32 border-4 border-white">
              <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
              <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">{doctor.name}</h1>
              <p className="text-xl mt-2">{doctor.specialty}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                  <Clock className="w-4 h-4 mr-1" />
                  {doctor.experience}
                </Badge>
                <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                  <Star className="w-4 h-4 mr-1" />
                  {doctor.rating}
                </Badge>
                <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                  {doctor.availability}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold text-teal-800 mb-4">About</h2>
              <p className="text-gray-600">{doctor.about}</p>

              <Separator className="my-6" />

              <h2 className="text-2xl font-semibold text-teal-800 mb-4">Education</h2>
              <ul className="list-disc list-inside text-gray-600">
                {doctor.education?.map((edu, index) => (
                  <li key={index} className="flex items-start mb-2">
                    <GraduationCap className="w-5 h-5 mr-2 text-teal-600 flex-shrink-0 mt-1" />
                    {edu}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="bg-teal-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-teal-800 mb-4">Consultation Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-teal-600 mr-2" />
                    <span className="text-gray-600">Languages: {doctor.languages?.join(', ')}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-teal-600 mr-2" />
                    <span className="text-gray-600">Consultation Fee: {doctor.consultationFee}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <Button
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    onClick={handleChat}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat Now
                  </Button>
                  <Button
                    className="w-full bg-teal-100 hover:bg-teal-200 text-teal-800"
                    onClick={handleVideoCall}
                  >
                    <VideoIcon className="w-4 h-4 mr-2" />
                    Video Call
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
