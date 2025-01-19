'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Info, AlertCircle } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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

interface Prescription {
  id: string
  date: string
  doctorName: string
  medicines: Medicine[]
  notes?: string
}

export default function PrescriptionViewer() {
  const [selectedMedicine, setSelectedMedicine] = useState<string>('')
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null)
  const [loading, setLoading] = useState(false)

  // This would normally come from your database
  const prescriptions: Prescription[] = [
    {
      id: '1',
      date: '2024-02-20',
      doctorName: 'Dr. Sarah Smith',
      medicines: [
        {
          name: 'Paracetamol',
          dosage: '500mg',
          frequency: 'Twice daily',
          duration: '5 days'
        },
        {
          name: 'Amoxicillin',
          dosage: '250mg',
          frequency: 'Three times daily',
          duration: '7 days'
        }
      ],
      notes: 'Take medicine after meals. Drink plenty of water.'
    }
  ]

  const fetchMedicineInfo = async (medicineName: string) => {
    try {
      setLoading(true)
      setSelectedMedicine(medicineName)
      const response = await fetch(`https://medicine-data-lstd.onrender.com/get_medicine_info?medicine_name=${encodeURIComponent(medicineName)}`)
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
          <CardTitle className="text-xl font-semibold text-teal-800">My Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-4">
            {prescriptions.map((prescription) => (
              <AccordionItem key={prescription.id} value={prescription.id}>
                <AccordionTrigger className="hover:bg-teal-50 px-4 py-2 rounded-lg">
                  <div className="flex flex-col items-start">
                    <span className="text-teal-800 font-medium">
                      Prescription from {prescription.doctorName}
                    </span>
                    <span className="text-sm text-teal-600">
                      {new Date(prescription.date).toLocaleDateString()}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  <div className="space-y-4">
                    {prescription.medicines.map((medicine, index) => (
                      <Card key={index} className="bg-white border border-teal-100">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-teal-800">{medicine.name}</h3>
                              <div className="text-sm text-teal-600 mt-1">
                                <p>Dosage: {medicine.dosage}</p>
                                <p>Frequency: {medicine.frequency}</p>
                                <p>Duration: {medicine.duration}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                              onClick={() => fetchMedicineInfo(medicine.name)}
                            >
                              <Info className="h-4 w-4" />
                              <span className="ml-2">Info</span>
                            </Button>
                          </div>

                          {selectedMedicine === medicine.name && medicineInfo && (
                            <div className="mt-4 p-4 bg-teal-50 rounded-lg">
                              <div className="space-y-3 text-sm">
                                {medicineInfo.uses && (
                                  <div>
                                    <span className="font-medium text-teal-700">Uses:</span>
                                    <ul className="list-disc list-inside text-teal-600 ml-2">
                                      {medicineInfo.uses.map((use, i) => (
                                        <li key={i}>{use}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {medicineInfo.side_effects && (
                                  <div>
                                    <span className="font-medium text-teal-700">Side Effects:</span>
                                    <ul className="list-disc list-inside text-teal-600 ml-2">
                                      {medicineInfo.side_effects.map((effect, i) => (
                                        <li key={i}>{effect}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {medicineInfo.precautions && (
                                  <div>
                                    <span className="font-medium text-teal-700">Precautions:</span>
                                    <ul className="list-disc list-inside text-teal-600 ml-2">
                                      {medicineInfo.precautions.map((precaution, i) => (
                                        <li key={i}>{precaution}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                    {prescription.notes && (
                      <div className="flex gap-2 p-4 bg-yellow-50 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                        <p className="text-yellow-800">{prescription.notes}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
} 