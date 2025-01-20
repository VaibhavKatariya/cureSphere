'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { storage, db } from '@/app/Firebase/config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { toast } from "@/hooks/use-toast"
import { FileUp, Image as ImageIcon } from 'lucide-react'

export default function DoctorScans({ doctorId }: { doctorId: string }) {
  const [uploading, setUploading] = useState(false)
  const [patientId, setPatientId] = useState('')
  const [scanType, setScanType] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      })
      return
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive"
      })
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile || !patientId || !scanType) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and select a file",
        variant: "destructive"
      })
      return
    }

    setUploading(true)

    try {
      // Upload file to storage
      const fileRef = ref(storage, `scans/${doctorId}/${patientId}/${Date.now()}-${selectedFile.name}`)
      const snapshot = await uploadBytes(fileRef, selectedFile)
      const downloadUrl = await getDownloadURL(snapshot.ref)

      // Save scan record to Firestore
      await addDoc(collection(db, 'scans'), {
        doctorId,
        patientId,
        type: scanType,
        imageUrl: downloadUrl,
        createdAt: serverTimestamp(),
        fileName: selectedFile.name
      })

      toast({
        title: "Success",
        description: "Scan uploaded successfully"
      })

      // Reset form
      setSelectedFile(null)
      setPatientId('')
      setScanType('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error uploading scan:', error)
      toast({
        title: "Error",
        description: "Failed to upload scan",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Upload New Scan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Patient ID</label>
            <Input
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Enter patient ID"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Scan Type</label>
            <Input
              value={scanType}
              onChange={(e) => setScanType(e.target.value)}
              placeholder="e.g., X-Ray, MRI, CT Scan"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Scan Image</label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleUpload}
            disabled={uploading || !selectedFile || !patientId || !scanType}
            className="w-full"
          >
            {uploading ? (
              'Uploading...'
            ) : (
              <>
                <FileUp className="w-4 h-4 mr-2" />
                Upload Scan
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <ScrollArea className="h-[400px]">
          <CardContent>
            {/* Add scan list here */}
            <div className="text-center text-gray-500 py-4">
              Scan history will appear here
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  )
} 