'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Search } from 'lucide-react'

interface MedicineInfo {
  medicine_name: string
  composition: string
  uses: string
  side_effects: string
}

export default function Prescription() {
  const [currentMedicine, setCurrentMedicine] = useState('')
  const [loading, setLoading] = useState(false)
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo[]>([])

  const fetchMedicineInfo = async (medicineName: string) => {
    try {
      setLoading(true)
      const response = await fetch(`https://medicine-data-lstd.onrender.com/get_medicine_info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ medicine_name: medicineName }),
      })
      const data = await response.json()
      setMedicineInfo(data)
    } catch (error) {
      console.error('Error fetching medicine info:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-teal-800">Search Medicine</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="medicine">Medicine Name</Label>
              <div className="relative">
                <Input
                  id="medicine"
                  value={currentMedicine}
                  onChange={(e) => setCurrentMedicine(e.target.value)}
                  placeholder="Enter medicine name"
                  className="pr-10"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => fetchMedicineInfo(currentMedicine)}
                  disabled={!currentMedicine || loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Medicine Information Display */}
            {loading && (
              <div className="text-center py-4">
                <span className="text-teal-600">Loading medicine information...</span>
              </div>
            )}

            {!loading && medicineInfo.length > 0 && (
              <div className="space-y-4 mt-4">
                {medicineInfo.map((medicine, index) => (
                  <Card key={index} className="border border-teal-100">
                    <CardHeader>
                      <CardTitle className="text-lg text-teal-800">{medicine.medicine_name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-teal-700 mb-2">Composition:</h4>
                        <p className="text-gray-600">{medicine.composition}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-teal-700 mb-2">Uses:</h4>
                        <p className="text-gray-600">{medicine.uses}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-teal-700 mb-2">Side Effects:</h4>
                        <p className="text-gray-600">{medicine.side_effects}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
