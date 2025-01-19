'use client'

import { useState } from 'react'
import { useMediaQuery } from '@/hooks/use-media-query'
import MobileDashboard from "@/components/ui/mobile-dashboard"
import DesktopDashboard from '@/components/ui/desktop-dashboard'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: "Amanda Wilson",
    age: "28",
    sex: "Female",
    height: "165",
    weight: "62",
    avatar: "/placeholder.svg"
  })

  const isDesktop = useMediaQuery("(min-width: 768px)")

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

  return isDesktop ? (
    <DesktopDashboard {...dashboardProps} />
  ) : (
    <MobileDashboard {...dashboardProps} />
  )
}
