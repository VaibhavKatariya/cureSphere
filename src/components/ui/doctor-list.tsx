// components/DoctorList.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/app/Firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Search } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';

// Define the specialties
const specialties = [
  "All",
  "Orthopedics",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Dermatology",
];

const DoctorList = () => {
  const router = useRouter();
  const [doctorsData, setDoctorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsRef = collection(db, "doctors");
        const doctorSnapshot = await getDocs(doctorsRef);
        const doctorList = doctorSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDoctorsData(doctorList);
      } catch (error) {
        console.error("Error fetching doctors data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return <p>Loading doctors...</p>;
  }

  const filteredDoctors = doctorsData.filter(doctor => {
    const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialty === selectedSpecialty;
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  const handleDoctorClick = (doctorId) => {
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
                src={doctor.avatar || "/placeholder.svg"}
                alt={doctor.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{doctor.name}</h3>
                <p className="text-gray-600">{doctor.specialty}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <span>{doctor.experience} years</span>
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
};

export default DoctorList;
