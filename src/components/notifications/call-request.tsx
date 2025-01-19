'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, X } from 'lucide-react'
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/app/Firebase/config'

interface CallRequestProps {
  callId: string
  callerName: string
  onAccept: () => void
  onDecline: () => void
}

export default function CallRequest({ callId, callerName, onAccept, onDecline }: CallRequestProps) {
  return (
    <Card className="fixed top-4 right-4 w-80 shadow-lg z-50 bg-white">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-100 rounded-full">
            <Phone className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h3 className="font-medium">Incoming Call</h3>
            <p className="text-sm text-gray-500">{callerName} is calling you</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 p-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onDecline}
          className="text-red-600 hover:text-red-700"
        >
          Decline
        </Button>
        <Button
          size="sm"
          onClick={onAccept}
          className="bg-teal-600 hover:bg-teal-700"
        >
          Accept
        </Button>
      </CardFooter>
    </Card>
  )
} 