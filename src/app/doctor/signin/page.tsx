'use client'

import { useState, useEffect } from 'react'
import { useSignInWithEmailAndPassword, useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/app/Firebase/config'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Stethoscope, Mail, Lock } from 'lucide-react'

export default function DoctorLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [signInWithEmailAndPassword, user, loading, firebaseError] = useSignInWithEmailAndPassword(auth)
  const [authUser, authLoading] = useAuthState(auth)
  const router = useRouter()

  useEffect(() => {
    if (authUser) {
      router.push('/doctor/dashboard')
    }
  }, [authUser, router])

  const handleSignIn = async (e:any) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    const result = await signInWithEmailAndPassword(email, password)
    if (result) {
      setEmail('')
      setPassword('')
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
          <CardTitle className="text-2xl font-bold text-center text-blue-800">Doctor Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-blue-700 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Enter your password" 
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
              {loading ? 'Loading...' : 'Log In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/doctor/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot your password?
          </Link>
          <div className="text-sm text-gray-600">
            Not registered yet?{' '}
            <Link href="/doctor/signup" className="text-blue-600 hover:underline">
              Sign up as a Doctor
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 