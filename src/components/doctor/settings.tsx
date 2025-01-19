'use client'

import { useState } from 'react'
import { db } from '@/app/Firebase/config'
import { doc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
// import { toast } from "@/components/ui/toast"

interface DoctorData {
  name: string
  specialty: string
  hospital: string
  experience: string
  bio?: string
  consultationFee?: string
  avatar: string
  availability: string
  acceptingNewPatients?: boolean
}

export default function DoctorSettings({ 
  doctorData, 
  doctorId 
}: { 
  doctorData: DoctorData
  doctorId: string 
}) {
  const [formData, setFormData] = useState(doctorData)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (!e.target.files?.[0]) return

  //   try {
  //     // setLoading(true)
  //     // const file = e.target.files[0]
  //     // // const storageRef = ref(storage, `doctors/${doctorId}/avatar`)
  //     // await uploadBytes(storageRef, file)
  //     // const url = await getDownloadURL(storageRef)
      
  //     // setFormData(prev => ({ ...prev, avatar: url }))
  //     // await updateDoc(doc(db, 'doctors', doctorId), { avatar: url })
  //     // toast({
  //     //   title: "Success",
  //     //   description: "Profile picture updated successfully",
  //     // })
  //   } catch (error) {
  //     console.error('Error uploading image:', error)
  //     toast({
  //       title: "Error",
  //       description: "Failed to update profile picture",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setLoading(false)
  //   }
  // // }

  const handleSubmit = async (e: React.FormEvent) => {
    // e.preventDefault()
    // setLoading(true)

    // try {
    //   await updateDoc(doc(db, 'doctors', doctorId), formData)
    //   toast({
    //     title: "Success",
    //     description: "Profile updated successfully",
    //   })
    // } catch (error) {
    //   console.error('Error updating profile:', error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to update profile",
    //     variant: "destructive",
    //   })
    // } finally {
    //   setLoading(false)
    // }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={formData.avatar || '/placeholder.svg'}
              alt={formData.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            {/* <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="max-w-[200px]"
            /> */}
          </div>

          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="specialty">Specialty</Label>
              <Input
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="hospital">Hospital/Clinic</Label>
              <Input
                id="hospital"
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="consultationFee">Consultation Fee</Label>
              <Input
                id="consultationFee"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.acceptingNewPatients}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, acceptingNewPatients: checked }))
                }
              />
              <Label>Accepting New Patients</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        type="submit" 
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
} 