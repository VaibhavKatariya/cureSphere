import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';

// Sample doctor data - you can move this to a separate file
const doctorsData = [
  {
    id: 1,
    name: "Dr. Sarah Smith",
    specialty: "Orthopedics",
    experience: "15 years",
    rating: 4.8,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 2,
    name: "Dr. John Doe",
    specialty: "Cardiology",
    experience: "12 years",
    rating: 4.7,
    avatar: "/placeholder.svg",
    availability: "Busy",
  },
  {
    id: 3,
    name: "Dr. Emily Johnson",
    specialty: "Pediatrics",
    experience: "10 years",
    rating: 4.9,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 4,
    name: "Dr. Michael Brown",
    specialty: "Neurology",
    experience: "18 years",
    rating: 4.6,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 5,
    name: "Dr. Olivia Davis",
    specialty: "Dermatology",
    experience: "8 years",
    rating: 4.5,
    avatar: "/placeholder.svg",
    availability: "Busy",
  },
  {
    id: 6,
    name: "Dr. William Garcia",
    specialty: "Gastroenterology",
    experience: "20 years",
    rating: 4.8,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 7,
    name: "Dr. Sophia Martinez",
    specialty: "Gynecology",
    experience: "7 years",
    rating: 4.7,
    avatar: "/placeholder.svg",
    availability: "Busy",
  },
  {
    id: 8,
    name: "Dr. James Hernandez",
    specialty: "Radiology",
    experience: "14 years",
    rating: 4.4,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 9,
    name: "Dr. Isabella Wilson",
    specialty: "Psychiatry",
    experience: "13 years",
    rating: 4.9,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 10,
    name: "Dr. Benjamin Taylor",
    specialty: "Oncology",
    experience: "16 years",
    rating: 4.6,
    avatar: "/placeholder.svg",
    availability: "Busy",
  },
  {
    id: 11,
    name: "Dr. Mia Anderson",
    specialty: "Orthopedics",
    experience: "9 years",
    rating: 4.8,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 12,
    name: "Dr. Ethan Thomas",
    specialty: "Cardiology",
    experience: "22 years",
    rating: 4.9,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 13,
    name: "Dr. Charlotte Moore",
    specialty: "Endocrinology",
    experience: "11 years",
    rating: 4.7,
    avatar: "/placeholder.svg",
    availability: "Busy",
  },
  {
    id: 14,
    name: "Dr. Alexander Jackson",
    specialty: "Nephrology",
    experience: "17 years",
    rating: 4.6,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 15,
    name: "Dr. Amelia Martin",
    specialty: "Pulmonology",
    experience: "10 years",
    rating: 4.7,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 16,
    name: "Dr. Logan White",
    specialty: "Neurology",
    experience: "19 years",
    rating: 4.8,
    avatar: "/placeholder.svg",
    availability: "Busy",
  },
  {
    id: 17,
    name: "Dr. Harper Harris",
    specialty: "Dermatology",
    experience: "6 years",
    rating: 4.5,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 18,
    name: "Dr. Mason Clark",
    specialty: "Psychiatry",
    experience: "15 years",
    rating: 4.7,
    avatar: "/placeholder.svg",
    availability: "Busy",
  },
  {
    id: 19,
    name: "Dr. Evelyn Lewis",
    specialty: "Pediatrics",
    experience: "12 years",
    rating: 4.9,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 20,
    name: "Dr. Lucas Lee",
    specialty: "Orthopedics",
    experience: "20 years",
    rating: 4.8,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 21,
    name: "Dr. Ella Walker",
    specialty: "Cardiology",
    experience: "8 years",
    rating: 4.6,
    avatar: "/placeholder.svg",
    availability: "Busy",
  },
  {
    id: 22,
    name: "Dr. Henry Hall",
    specialty: "Radiology",
    experience: "14 years",
    rating: 4.7,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 23,
    name: "Dr. Chloe Allen",
    specialty: "Gynecology",
    experience: "9 years",
    rating: 4.5,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 24,
    name: "Dr. Aiden Young",
    specialty: "Oncology",
    experience: "18 years",
    rating: 4.8,
    avatar: "/placeholder.svg",
    availability: "Busy",
  },
  {
    id: 25,
    name: "Dr. Scarlett King",
    specialty: "Nephrology",
    experience: "13 years",
    rating: 4.7,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 26,
    name: "Dr. Jack Wright",
    specialty: "Endocrinology",
    experience: "16 years",
    rating: 4.9,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 27,
    name: "Dr. Lily Scott",
    specialty: "Gastroenterology",
    experience: "7 years",
    rating: 4.8,
    avatar: "/placeholder.svg",
    availability: "Busy",
  },
  {
    id: 28,
    name: "Dr. Daniel Green",
    specialty: "Dermatology",
    experience: "22 years",
    rating: 4.6,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 29,
    name: "Dr. Aurora Adams",
    specialty: "Pulmonology",
    experience: "10 years",
    rating: 4.7,
    avatar: "/placeholder.svg",
    availability: "Busy",
  },
  {
    id: 30,
    name: "Dr. Noah Baker",
    specialty: "Neurology",
    experience: "25 years",
    rating: 4.9,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 31,
    name: "Dr. Grace Rivera",
    specialty: "Cardiology",
    experience: "12 years",
    rating: 4.5,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 32,
    name: "Dr. Liam Carter",
    specialty: "Orthopedics",
    experience: "18 years",
    rating: 4.8,
    avatar: "/placeholder.svg",
    availability: "Busy",
  },
  {
    id: 33,
    name: "Dr. Zoe Perez",
    specialty: "Psychiatry",
    experience: "14 years",
    rating: 4.6,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 34,
    name: "Dr. Isaac Evans",
    specialty: "Oncology",
    experience: "19 years",
    rating: 4.7,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 35,
    name: "Dr. Victoria Roberts",
    specialty: "Pediatrics",
    experience: "11 years",
    rating: 4.9,
    avatar: "/placeholder.svg",
    availability: "Busy",
  },
  {
    id: 36,
    name: "Dr. Elijah Diaz",
    specialty: "Gynecology",
    experience: "15 years",
    rating: 4.8,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 37,
    name: "Dr. Aria Thompson",
    specialty: "Radiology",
    experience: "6 years",
    rating: 4.5,
    avatar: "/placeholder.svg",
    availability: "Busy",
  },
  {
    id: 38,
    name: "Dr. Sebastian Torres",
    specialty: "Nephrology",
    experience: "21 years",
    rating: 4.6,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 39,
    name: "Dr. Stella Ramirez",
    specialty: "Endocrinology",
    experience: "10 years",
    rating: 4.7,
    avatar: "/placeholder.svg",
    availability: "Busy",
  },
  {
    id: 40,
    name: "Dr. Samuel Foster",
    specialty: "Gastroenterology",
    experience: "17 years",
    rating: 4.8,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 41,
    name: "Dr. Hazel Ross",
    specialty: "Psychiatry",
    experience: "13 years",
    rating: 4.9,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 42,
    name: "Dr. Nathan Morgan",
    specialty: "Dermatology",
    experience: "20 years",
    rating: 4.6,
    avatar: "/placeholder.svg",
    availability: "Busy",
  },
  {
    id: 43,
    name: "Dr. Ellie Bell",
    specialty: "Orthopedics",
    experience: "9 years",
    rating: 4.7,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 44,
    name: "Dr. Matthew Collins",
    specialty: "Cardiology",
    experience: "11 years",
    rating: 4.8,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 45,
    name: "Dr. Layla Mitchell",
    specialty: "Pulmonology",
    experience: "16 years",
    rating: 4.5,
    avatar: "/placeholder.svg",
    availability: "Busy",
  },
  {
    id: 46,
    name: "Dr. Owen Turner",
    specialty: "Neurology",
    experience: "23 years",
    rating: 4.9,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 47,
    name: "Dr. Hannah Campbell",
    specialty: "Gynecology",
    experience: "12 years",
    rating: 4.6,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 48,
    name: "Dr. Wyatt Phillips",
    specialty: "Oncology",
    experience: "18 years",
    rating: 4.7,
    avatar: "/placeholder.svg",
    availability: "Busy",
  },
  {
    id: 49,
    name: "Dr. Ellie Parker",
    specialty: "Nephrology",
    experience: "10 years",
    rating: 4.5,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {
    id: 50,
    name: "Dr. Levi Perez",
    specialty: "Endocrinology",
    experience: "14 years",
    rating: 4.8,
    avatar: "/placeholder.svg",
    availability: "Available",
  },
  {id:51,
    name: "efkjvh",
    specialty: "Cardiology",
    experience: "12 years",
    rating: 4.7,
    avatar: "/placeholder.svg",
    availability: "Busy",
  },
  {
    id: 52,
    name: "CICR",
    specialty: "Orthopedics",
    experience: "10 years",
    rating: 4.9,
    avatar: "/placeholder.svg",
    availablity: "Available",
  },{
    id: 53,
    name: "wqd  ",
    specialty: "Neurology",
    experience: "18 years",
    rating: 4.6,
    avatar: "/placeholder.svg",
    availability: "Available",
  }
];

const specialties = [
  "All",
  "Orthopedics",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Dermatology",
];

export default function DoctorList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const filteredDoctors = doctorsData.filter(doctor => {
    const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialty === selectedSpecialty;
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  const handleDoctorClick = (doctorId: number) => {
    router.push(`/doctor/${doctorId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search doctors..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          {specialties.map(specialty => (
            <option key={specialty} value={specialty}>
              {specialty}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4">
        {filteredDoctors.map(doctor => (
          <div
            key={doctor.id}
            className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleDoctorClick(doctor.id)}
          >
            <div className="flex items-center gap-4">
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{doctor.name}</h3>
                <p className="text-gray-600">{doctor.specialty}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <span>{doctor.experience}</span>
                  <span>★ {doctor.rating}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    doctor.availability === 'Available'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {doctor.availability}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 