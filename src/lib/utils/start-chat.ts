import { db } from '@/app/Firebase/config'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

export async function startChatWithDoctor(userId: string, doctorId: string) {
  // Check doctor availability first
  const doctorRef = doc(db, 'doctors', doctorId)
  const doctorSnap = await getDoc(doctorRef)
  
  if (!doctorSnap.exists()) {
    throw new Error('Doctor not found')
  }

  const doctorData = doctorSnap.data()
  
  if (!doctorData.isAvailable) {
    throw new Error('Doctor is currently unavailable')
  }

  // Create chat document
  const chatRef = doc(collection(db, 'chats'))
  await setDoc(chatRef, {
    participants: [userId, doctorId],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastMessage: 'Chat started',
    status: 'active'
  })

  return chatRef.id
} 