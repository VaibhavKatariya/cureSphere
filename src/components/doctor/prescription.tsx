'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Search, Loader2 } from 'lucide-react'

interface MedicineInfo {
  name: string
  uses: string[]
  side_effects: string[]
  precautions: string[]
}

interface Medicine {
  name: string
  dosage: string
  frequency: string
  duration: string
  info?: MedicineInfo
}

export default function Prescription() {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [currentMedicine, setCurrentMedicine] = useState('')
  const [loading, setLoading] = useState(false)
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null)

  const fetchMedicineInfo = async (medicineName: string) => {
    try {
      setLoading(true)
      const response = await fetch(`https://medicine-data-lstd.onrender.com/get_medicine_info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type'
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

  const handleAddMedicine = () => {
    if (currentMedicine && medicineInfo) {
      setMedicines([...medicines, {
        name: currentMedicine,
        dosage: '',
        frequency: '',
        duration: '',
        info: medicineInfo
      }])
      setCurrentMedicine('')
      setMedicineInfo(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-teal-800">New Prescription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
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
              <Button
                onClick={handleAddMedicine}
                disabled={!medicineInfo}
                className="self-end"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            {medicineInfo && (
              <Card className="bg-teal-50">
                <CardContent className="pt-4">
                  <h3 className="font-medium text-teal-800 mb-2">Medicine Information</h3>
                  <div className="space-y-2 text-sm">
                    {medicineInfo.uses && (
                      <div>
                        <span className="font-medium text-teal-700">Uses:</span>
                        <ul className="list-disc list-inside text-teal-600">
                          {medicineInfo.uses.map((use, index) => (
                            <li key={index}>{use}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {medicineInfo.side_effects && (
                      <div>
                        <span className="font-medium text-teal-700">Side Effects:</span>
                        <ul className="list-disc list-inside text-teal-600">
                          {medicineInfo.side_effects.map((effect, index) => (
                            <li key={index}>{effect}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {medicineInfo.precautions && (
                      <div>
                        <span className="font-medium text-teal-700">Precautions:</span>
                        <ul className="list-disc list-inside text-teal-600">
                          {medicineInfo.precautions.map((precaution, index) => (
                            <li key={index}>{precaution}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {medicines.length > 0 && (
              <div className="space-y-4 mt-6">
                <h3 className="font-medium text-teal-800">Prescribed Medicines</h3>
                {medicines.map((medicine, index) => (
                  <Card key={index} className="bg-white">
                    <CardContent className="pt-4">
                      <div className="grid gap-4">
                        <div className="font-medium text-teal-800">{medicine.name}</div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Dosage</Label>
                            <Input
                              value={medicine.dosage}
                              onChange={(e) => {
                                const updatedMedicines = [...medicines]
                                updatedMedicines[index].dosage = e.target.value
                                setMedicines(updatedMedicines)
                              }}
                              placeholder="e.g., 500mg"
                            />
                          </div>
                          <div>
                            <Label>Frequency</Label>
                            <Input
                              value={medicine.frequency}
                              onChange={(e) => {
                                const updatedMedicines = [...medicines]
                                updatedMedicines[index].frequency = e.target.value
                                setMedicines(updatedMedicines)
                              }}
                              placeholder="e.g., Twice daily"
                            />
                          </div>
                          <div>
                            <Label>Duration</Label>
                            <Input
                              value={medicine.duration}
                              onChange={(e) => {
                                const updatedMedicines = [...medicines]
                                updatedMedicines[index].duration = e.target.value
                                setMedicines(updatedMedicines)
                              }}
                              placeholder="e.g., 7 days"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional instructions or notes..."
                rows={4}
              />
            </div>

            <Button className="w-full bg-teal-600 hover:bg-teal-700">
              Save Prescription
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 