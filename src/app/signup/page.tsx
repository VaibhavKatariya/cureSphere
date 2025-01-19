'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Lock, Phone, Stethoscope, BookOpen } from 'lucide-react'
import { auth } from '@/app/Firebase/config' // Import Firebase authentication
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"

type FormData = {
  name: string
  email: string
  password: string
  phone: string
  license: string
  specialization: string
}

const errorMessages: Record<string, string> = {
  'auth/invalid-email': 'Invalid email address.',
  'auth/user-not-found': 'No user found with this email.',
  'auth/wrong-password': 'Wrong password.',
  'auth/weak-password': 'Password should be at least 6 characters long.',
  'auth/email-already-in-use': 'Email already in use.',
  'auth/operation-not-allowed': 'Operation not allowed.',
  'auth/requires-recent-login': 'Please reauthenticate and try again.',
  'auth/credential-already-in-use': 'Credential is already in use.',
  'auth/invalid-credential': 'Invalid credentials provided.',
  'auth/popup-closed-by-user': 'Popup closed by user.',
}

export default function SignUp() {
  const [userType, setUserType] = useState<'user' | 'doctor'>('user')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    license: '',
    specialization: ''
  })
  const [loading, setLoading] = useState<boolean>(false) // To manage loading state
  const [error, setError] = useState<string | null>(null) // To handle error messages
  const router = useRouter()

  // Handle form data changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form submission for user signup
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null) // Reset previous errors

    try {
      // Signing up user with Firebase Authentication
      const { email, password, name, phone } = formData
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Save name and phone number in user profile
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name,
          phoneNumber: phone
        })
      }

      // Clear form after successful signup
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        license: '',
        specialization: ''
      })

      // Redirect user to another page (e.g., home or dashboard)
      router.push('/dashboard') // Change '/dashboard' to your desired route

    } catch (error: any) {
      // Check for specific Firebase error codes and display custom messages
      if (error.code) {
        const message = errorMessages[error.code] || 'An unexpected error occurred.'
        setError(message)
      } else {
        setError('An error occurred while signing up.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-teal-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-teal-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="text-red-500 text-center mb-4">
              {error}
            </div>
          )}

          <Tabs defaultValue="user" className="w-full" onValueChange={(value) => setUserType(value as 'user' | 'doctor')}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="user">User</TabsTrigger>
              <TabsTrigger value="doctor">Doctor</TabsTrigger>
            </TabsList>

            <TabsContent value="user">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="name" className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Email address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Phone Number (optional)
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                    {loading ? (
                      <Stethoscope className="animate-spin w-5 h-5" />
                    ) : (
                      'Sign Up'
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* Doctor Tab (remains unchanged) */}
            <TabsContent value="doctor">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="doctor-name" className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Name
                  </Label>
                  <Input
                    id="doctor-name"
                    name="name"
                    type="text"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="doctor-email" className="flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Email address
                  </Label>
                  <Input
                    id="doctor-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="license" className="flex items-center">
                    <Stethoscope className="w-5 h-5 mr-2" />
                    Medical License Number
                  </Label>
                  <Input
                    id="license"
                    name="license"
                    type="text"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="specialization" className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Specialization
                  </Label>
                  <Input
                    id="specialization"
                    name="specialization"
                    type="text"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                    {loading ? (
                      <Stethoscope className="animate-spin w-5 h-5" />
                    ) : (
                      'Sign Up as Doctor'
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            Already have an account?{' '}
            <Link href="/signin" className="font-medium text-teal-600 hover:text-teal-500">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
