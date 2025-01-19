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
import { Plus, X } from 'lucide-react'
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
  about?: string
  education?: string[]
  languages?: string[]
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
  const [newEducation, setNewEducation] = useState('')
  const [newLanguage, setNewLanguage] = useState('')

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
    e.preventDefault()
    setLoading(true)

    try {
      await updateDoc(doc(db, 'doctors', doctorId), formData)
      console.log('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const addEducation = () => {
    if (newEducation.trim()) {
      setFormData(prev => ({
        ...prev,
        education: [...(prev.education || []), newEducation.trim()]
      }))
      setNewEducation('')
    }
  }

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education?.filter((_, i) => i !== index)
    }))
  }

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setFormData(prev => ({
        ...prev,
        languages: [...(prev.languages || []), newLanguage.trim()]
      }))
      setNewLanguage('')
    }
  }

  const removeLanguage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages?.filter((_, i) => i !== index)
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="about">About Me</Label>
              <Textarea
                id="about"
                name="about"
                value={formData.about || ''}
                onChange={handleChange}
                rows={6}
                placeholder="Write a brief description about your medical practice, experience, and approach..."
                className="mt-1"
              />
            </div>

            <div>
              <Label>Education & Qualifications</Label>
              <div className="space-y-2">
                {formData.education?.map((edu, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 p-2 bg-gray-50 rounded">{edu}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={newEducation}
                    onChange={(e) => setNewEducation(e.target.value)}
                    placeholder="Add education (e.g., MBBS - University Name)"
                  />
                  <Button
                    type="button"
                    onClick={addEducation}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label>Languages Spoken</Label>
              <div className="space-y-2">
                {formData.languages?.map((lang, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 p-2 bg-gray-50 rounded">{lang}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLanguage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Add language"
                  />
                  <Button
                    type="button"
                    onClick={addLanguage}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="consultationFee">Consultation Fee (₹)</Label>
              <Input
                id="consultationFee"
                name="consultationFee"
                type="number"
                value={formData.consultationFee || ''}
                onChange={handleChange}
                placeholder="Enter your consultation fee"
                className="mt-1"
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
        className="w-full bg-teal-600 hover:bg-teal-700"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
} 