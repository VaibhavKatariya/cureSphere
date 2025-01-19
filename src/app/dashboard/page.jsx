'use client'

import { useState, useEffect } from 'react'
import { useMediaQuery } from '@/hooks/use-media-query'
import MobileDashboard from "@/components/ui/mobile-dashboard"
import DesktopDashboard from '@/components/ui/desktop-dashboard'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/app/Firebase/config'

export default function Dashboard() {
  const [user] = useAuthState(auth)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: 'Default User', // Default name before we check for Firebase user name
    age: '28',
    sex: 'Female',
    height: '165',
    weight: '62',
    avatar: '/placeholder.svg',
  })

  const isDesktop = useMediaQuery('(min-width: 768px)')

  // Fetch user information on user state change
  useEffect(() => {
    if (user) {
      // If the Firebase user has a displayName, use it; otherwise, use the default
      setUserInfo(prev => ({
        ...prev,
        name: user.displayName || 'Default User',
      }))
    }
  }, [user]) // Dependency on user, to update userInfo whenever user changes

  const handleEdit = () => setIsEditing(true)
  const handleSave = () => setIsEditing(false)
  const handleCancel = () => setIsEditing(false)
  const handleChange = (e) => {
    setUserInfo(prev => ({ ...prev, [e.target.name]: e.target.value }))
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

  if (!user) {
    return (
      <div>
        <p>You are not signed in. Please log in to access the dashboard.</p>
      </div>
    )
  }

  return isDesktop ? (
    <DesktopDashboard {...dashboardProps} />
  ) : (
    <MobileDashboard {...dashboardProps} />
  )
}
