'use client'

import DiagnosticChatbot from '@/components/diagnosis/diagnostic-chatbot'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DiagnosisPage() {
  return (
    <div className="container p-6">
      <h1 className="text-2xl font-bold mb-6">Diagnosis Dashboard</h1>
      
      <Tabs defaultValue="chatbot" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chatbot">AI Symptom Checker</TabsTrigger>
          <TabsTrigger value="history">Recent Diagnoses</TabsTrigger>
        </TabsList>

        <TabsContent value="chatbot" className="space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-yellow-700">
              <strong>Disclaimer:</strong> This AI-powered tool is for informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </div>
          <DiagnosticChatbot />
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Diagnoses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">No recent diagnoses to display.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 