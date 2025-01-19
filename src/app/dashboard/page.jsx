'use client'

import { useState, useEffect } from 'react'
import { useMediaQuery } from '@/hooks/use-media-query'
import MobileDashboard from "@/components/ui/mobile-dashboard"
import DesktopDashboard from '@/components/ui/desktop-dashboard'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '@/app/Firebase/config'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user] = useAuthState(auth)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  const isDesktop = useMediaQuery('(min-width: 768px)')
  const router = useRouter()

  // Fetch user information on user state change
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            setUserInfo(userDoc.data())
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        } finally {
          setLoading(false)
        }
      } else {
        // Redirect to the sign-in page if the user is not logged in
        router.push('/signin')
      }
    }

    fetchUserData()
  }, [user, router])

  const handleEdit = () => setIsEditing(true)
  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'users', user.uid), userInfo)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating user data:', error)
    }
  }
  const handleCancel = () => setIsEditing(false)
  const handleChange = (e) => {
    setUserInfo(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const dashboardProps = {
    activeTab,
    setActiveTab,
    isEditing,
    userInfo,
    handleEdit,
    handleSave,
    handleCancel,
    handleChange,
  }

  if (loading || !userInfo) {
    return <div>Loading...</div>
  }

  return isDesktop ? (
    <DesktopDashboard {...dashboardProps} />
  ) : (
    <MobileDashboard {...dashboardProps} />
  )
}
