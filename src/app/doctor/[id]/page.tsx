'use client'

import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { VideoIcon, MessageSquare, Star, Clock, Globe, DollarSign, GraduationCap } from 'lucide-react'

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
    about: "Dr. Sarah Smith is a board-certified orthopedic surgeon specializing in sports medicine and joint replacement. With a passion for helping patients regain mobility and improve their quality of life, Dr. Smith combines her extensive experience with the latest advancements in orthopedic care.",
    education: [
      "MBBS - Harvard Medical School",
      "MS Orthopedics - Johns Hopkins University"
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-teal-500 text-white p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-32 h-32 border-4 border-white">
              <AvatarImage src={doctor.avatar} alt={doctor.name} />
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
                {doctor.education.map((edu, index) => (
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
                    <span className="text-gray-600">Languages: {doctor.languages.join(', ')}</span>
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

