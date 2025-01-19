import { WeekSchedule } from '@/types/schedule'

export function isDoctorAvailable(schedule: WeekSchedule): {
  isAvailable: boolean
  status: 'available' | 'busy' | 'unavailable'
} {
  if (!schedule) {
    return { isAvailable: false, status: 'unavailable' }
  }

  const now = new Date()
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' })
  const currentTime = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })

  const daySchedule = schedule[currentDay]
  
  if (!daySchedule?.isAvailable) {
    return { isAvailable: false, status: 'unavailable' }
  }

  const isInTimeSlot = daySchedule.timeSlots.some(slot => {
    const [startHour, startMinute] = slot.start.split(':').map(Number)
    const [endHour, endMinute] = slot.end.split(':').map(Number)
    const [currentHour, currentMinute] = currentTime.split(':').map(Number)

    const currentMinutes = currentHour * 60 + currentMinute
    const startMinutes = startHour * 60 + startMinute
    const endMinutes = endHour * 60 + endMinute

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes
  })

  if (!isInTimeSlot) {
    return { isAvailable: false, status: 'unavailable' }
  }

  // You can add additional logic here to check if doctor is in a call
  // or has pending appointments
  return { isAvailable: true, status: 'available' }
} 