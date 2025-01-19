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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Lock, Phone, Stethoscope, BookOpen } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

export default function SignUp() {
  const [userType, setUserType] = useState('user')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [sex, setSex] = useState('male')
  const [error, setError] = useState('')
  
  const [createUserWithEmailAndPassword, user, loading, firebaseError] = 
    useCreateUserWithEmailAndPassword(auth)
  const [authUser, authLoading] = useAuthState(auth)
  const router = useRouter()

  useEffect(() => {
    if (authUser) {
      router.push('/dashboard')
    }
  }, [authUser, router])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password || !name || !age || !sex) {
      setError('Please fill in all fields.')
      return
    }

    try {
      const result = await createUserWithEmailAndPassword(email, password)
      if (result?.user) {
        // Create user profile in Firestore
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          name,
          email,
          age,
          sex,
          avatar: '/placeholder.svg',
          createdAt: new Date().toISOString(),
          role: 'user',
          isPremium: false,
          premiumType: null,
          videoCallsRemaining: 0,
          prescriptionsRemaining: 0
        })
        // Update the user's display name in Firebase Auth
        await result.user.updateProfile({
          displayName: name
        })
      }
    } catch (err) {
      setError('Failed to create account. Please try again.')
      console.error('Signup error:', err)
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
          <Tabs defaultValue="user" className="w-full" onValueChange={(value) => setUserType(value)}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="user">User</TabsTrigger>
              <TabsTrigger value="doctor">Doctor</TabsTrigger>
            </TabsList>
            <TabsContent value="user">
              <form onSubmit={handleSignup} className="space-y-6">
                {error && (
                  <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <Label htmlFor="name" className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Name
                  </Label>
                  <Input id="name" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="age" className="flex items-center">
                    Age
                  </Label>
                  <Input id="age" name="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="sex" className="flex items-center">
                    Sex
                  </Label>
                  <select
                    id="sex"
                    name="sex"
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Email address
                  </Label>
                  <Input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="password" className="flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Password
                  </Label>
                  <Input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Phone Number (optional)
                  </Label>
                  <Input id="phone" name="phone" type="tel" className="mt-1" />
                </div>
                <div>
                  <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                    Sign Up
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="doctor">
              <form className="space-y-6" action="#" method="POST">
                <div>
                  <Label htmlFor="doctor-name" className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Name
                  </Label>
                  <Input id="doctor-name" name="name" type="text" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="doctor-email" className="flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Email address
                  </Label>
                  <Input id="doctor-email" name="email" type="email" autoComplete="email" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="license" className="flex items-center">
                    <Stethoscope className="w-5 h-5 mr-2" />
                    Medical License Number
                  </Label>
                  <Input id="license" name="license" type="text" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="specialization" className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Specialization
                  </Label>
                  <Input id="specialization" name="specialization" type="text" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="doctor-phone" className="flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Phone Number
                  </Label>
                  <Input id="doctor-phone" name="phone" type="tel" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="doctor-password" className="flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Password
                  </Label>
                  <Input id="doctor-password" name="password" type="password" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="confirm-password" className="flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Confirm Password
                  </Label>
                  <Input id="confirm-password" name="confirm-password" type="password" required className="mt-1" />
                </div>
                <div>
                  <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                    Sign Up as Doctor
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/signin" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-teal-600 hover:bg-gray-50">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
