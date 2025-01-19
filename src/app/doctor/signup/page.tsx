'use client'

import { useState, useEffect } from 'react'
import { useCreateUserWithEmailAndPassword, useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '@/app/Firebase/config'
import { doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Stethoscope, Mail, Lock, User, Award, Building } from 'lucide-react'

export default function DoctorSignup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [hospital, setHospital] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [error, setError] = useState('')
  
  const [createUserWithEmailAndPassword, user, loading, firebaseError] = 
    useCreateUserWithEmailAndPassword(auth)
  const [authUser, authLoading] = useAuthState(auth)
  const router = useRouter()

  useEffect(() => {
    if (authUser) {
      router.push('/doctor/dashboard')
    }
  }, [authUser, router])

  const handleSignup = async (e:any) => {
    e.preventDefault()
    setError('')

    if (!email || !password || !name || !specialty || !hospital || !licenseNumber) {
      setError('Please fill in all fields.')
      return
    }

    try {
      const result = await createUserWithEmailAndPassword(email, password)
      if (result?.user) {
        // Create doctor profile in Firestore
        await setDoc(doc(db, 'doctors', result.user.uid), {
          uid: result.user.uid,
          name,
          email,
          specialty,
          hospital,
          licenseNumber,
          experience: '0 years',
          rating: 0,
          availability: 'Available',
          avatar: '/placeholder.svg',
          createdAt: new Date().toISOString(),
          role: 'doctor',
          about: '',
          education: [],
          languages: [],
          consultationFee: '',
          acceptingNewPatients: true,
          searchKeywords: [
            name.toLowerCase(),
            specialty.toLowerCase(),
            hospital.toLowerCase(),
            // Add more searchable fields
          ]
        })
      }
    } catch (err) {
      setError('Failed to create account. Please try again.')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <Stethoscope className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Stethoscope className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-blue-800">Doctor Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-blue-700 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Full Name
              </Label>
              <Input 
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                className="w-full px-3 py-2 border rounded-md border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-blue-700 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Label>
              <Input 
                id="email" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="w-full px-3 py-2 border rounded-md border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty" className="text-sm font-medium text-blue-700 flex items-center">
                <Award className="w-4 h-4 mr-2" />
                Specialty
              </Label>
              <select
                id="specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Specialty</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Dermatology">Dermatology</option>
                {/* Add more specialties */}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hospital" className="text-sm font-medium text-blue-700 flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Hospital/Clinic
              </Label>
              <Input 
                id="hospital"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                required 
                className="w-full px-3 py-2 border rounded-md border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="license" className="text-sm font-medium text-blue-700 flex items-center">
                <Award className="w-4 h-4 mr-2" />
                License Number
              </Label>
              <Input 
                id="license"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                required 
                className="w-full px-3 py-2 border rounded-md border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-blue-700 flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Password
              </Label>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="w-full px-3 py-2 border rounded-md border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-gray-600 text-center w-full">
            Already have an account?{' '}
            <Link href="/doctor/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
          <div className="text-sm text-gray-600 text-center w-full">
            Not a doctor?{' '}
            <Link href="/doctor/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 