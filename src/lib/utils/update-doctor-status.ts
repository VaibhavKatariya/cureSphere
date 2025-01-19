import { db } from '@/app/Firebase/config'
import { doc, getDoc, updateDoc, serverTimestamp, query, collection, where, getDocs, writeBatch } from 'firebase/firestore'
import { isDoctorAvailable } from './doctor-availability'

export async function updateDoctorStatus(doctorId: string) {
  const docRef = doc(db, 'doctors', doctorId)
  const docSnap = await getDoc(docRef)
  
  if (!docSnap.exists()) return

  const schedule = docSnap.data().schedule
  const availability = isDoctorAvailable(schedule)

  await updateDoc(docRef, {
    status: availability.status,
    isAvailable: availability.isAvailable,
    lastStatusUpdate: serverTimestamp()
  })

  if (!availability.isAvailable) {
    const chatsQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', doctorId),
      where('status', '==', 'active')
    )

    const chatsSnapshot = await getDocs(chatsQuery)
    const batch = writeBatch(db)

    chatsSnapshot.docs.forEach(chatDoc => {
      batch.update(chatDoc.ref, {
        status: 'ended',
        endedAt: serverTimestamp(),
        endReason: 'doctor_unavailable'
      })
    })

    await batch.commit()
  }
} 