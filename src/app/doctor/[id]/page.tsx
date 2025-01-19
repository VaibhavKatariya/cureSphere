'use client'

import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { VideoIcon, MessageSquare } from 'lucide-react'

// This would normally come from an API
const getDoctorById = (id: string) => {
  return {
    id: parseInt(id),
    name: "Dr. Sarah Smith",
    specialty: "Orthopedics",
    experience: "15 years",
    rating: 4.8,
    avatar: "/placeholder.svg",
    availability: "Available",
    about: "Dr. Sarah Smith is a board-certified orthopedic surgeon specializing in sports medicine and joint replacement.",
    education: [
      "MBBS - Harvard Medical School",
      "MS Orthopedics - Johns Hopkins"
    ],
    languages: ["English", "Spanish"],
    consultationFee: "$100"
  };
};

export default function DoctorProfile() {
  const params = useParams();
  const doctor = getDoctorById(params.id as string);

  const handleChat = () => {
    window.location.href = `/chat/${doctor.id}`;
  };

  const handleVideoCall = () => {
    window.location.href = `/video-call/${doctor.id}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-40 h-40 rounded-full mx-auto"
            />
            <div className="mt-4 text-center">
              <h1 className="text-2xl font-bold">{doctor.name}</h1>
              <p className="text-gray-600">{doctor.specialty}</p>
            </div>
          </div>

          <div className="md:w-2/3">
            <div className="grid gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">About</h2>
                <p className="text-gray-600">{doctor.about}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Experience</h3>
                  <p className="text-gray-600">{doctor.experience}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Rating</h3>
                  <p className="text-gray-600">★ {doctor.rating}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Languages</h3>
                  <p className="text-gray-600">{doctor.languages.join(', ')}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Consultation Fee</h3>
                  <p className="text-gray-600">{doctor.consultationFee}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                  onClick={handleChat}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat Now
                </Button>
                <Button
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  onClick={handleVideoCall}
                >
                  <VideoIcon className="w-4 h-4 mr-2" />
                  Video Call
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 