'use client'

import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/app/Firebase/config'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"

export default function DoctorSettings({ doctorId, doctorData }: { doctorId: string; doctorData: any }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: doctorData?.name || '',
    email: doctorData?.email || '',
    phone: doctorData?.phone || '',
    specialty: doctorData?.specialty || '',
    qualifications: doctorData?.qualifications || '',
    experience: doctorData?.experience || '',
    bio: doctorData?.bio || '',
    consultationFee: doctorData?.consultationFee || '',
    isAvailable: doctorData?.isAvailable || false,
    avatar: doctorData?.avatar || '/placeholder.svg',
    languages: doctorData?.languages || ['English'],
    address: doctorData?.address || '',
    hospitalAffiliation: doctorData?.hospitalAffiliation || ''
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      const storageRef = ref(storage, `doctors/${doctorId}/profile/${file.name}`)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      setFormData(prev => ({ ...prev, avatar: downloadURL }))
      await updateDoc(doc(db, 'doctors', doctorId), { avatar: downloadURL })
      
      toast({
        title: "Success",
        description: "Profile picture updated successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Format the data before saving
      const updatedData = {
        ...formData,
        consultationFee: Number(formData.consultationFee),
        experience: Number(formData.experience),
        updatedAt: new Date(),
        // Add any computed or formatted fields here
      }

      const docRef = doc(db, 'doctors', doctorId)
      await updateDoc(docRef, updatedData)

      // Update the parent component's state
      if (doctorData && typeof doctorData.updateDoctorData === 'function') {
        doctorData.updateDoctorData(updatedData)
      }

      toast({
        title: "Success",
        description: "Profile updated successfully"
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={formData.avatar} />
            <AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={loading}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                disabled={loading}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              disabled={loading}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Address</label>
            <Textarea
              value={formData.address}
              onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Professional Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <label className="text-sm font-medium">Specialty</label>
            <Input
              value={formData.specialty}
              onChange={e => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
              disabled={loading}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Qualifications</label>
            <Input
              value={formData.qualifications}
              onChange={e => setFormData(prev => ({ ...prev, qualifications: e.target.value }))}
              disabled={loading}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Years of Experience</label>
            <Input
              type="number"
              value={formData.experience}
              onChange={e => setFormData(prev => ({ ...prev, experience: e.target.value }))}
              disabled={loading}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Hospital Affiliation</label>
            <Input
              value={formData.hospitalAffiliation}
              onChange={e => setFormData(prev => ({ 
                ...prev, 
                hospitalAffiliation: e.target.value 
              }))}
              disabled={loading}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              value={formData.bio}
              onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Consultation Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Consultation Fee (₹)</label>
            <Input
              type="number"
              value={formData.consultationFee}
              onChange={e => setFormData(prev => ({ 
                ...prev, 
                consultationFee: e.target.value 
              }))}
              disabled={loading}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={formData.isAvailable}
              onCheckedChange={checked => 
                setFormData(prev => ({ ...prev, isAvailable: checked }))
              }
              disabled={loading}
            />
            <label className="text-sm font-medium">Available for Consultations</label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
} 