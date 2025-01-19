'use client'

import { useState, useEffect, useRef } from 'react'
import { db } from '@/app/Firebase/config'
import { doc, setDoc, onSnapshot, updateDoc, deleteDoc, arrayUnion, serverTimestamp } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react'

interface VideoCallProps {
  callId: string
  currentUser: any
  otherUser: any
  onEndCall: () => void
  isDoctor?: boolean
}

export default function VideoCall({ callId, currentUser, otherUser, onEndCall, isDoctor }: VideoCallProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [callStatus, setCallStatus] = useState<'requesting' | 'connected' | 'ended'>('requesting')
  
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnection = useRef<RTCPeerConnection | null>(null)

  useEffect(() => {
    if (!isDoctor) {
      // If user is initiating the call, create a call request
      createCallRequest()
    } else {
      // If doctor is joining, start the call
      startCall()
    }
    return () => {
      cleanup()
    }
  }, [])

  const createCallRequest = async () => {
    try {
      await setDoc(doc(db, 'calls', callId), {
        status: 'requesting',
        createdAt: serverTimestamp(),
        from: {
          id: currentUser.uid,
          name: currentUser.displayName
        },
        to: {
          id: otherUser.id,
          name: otherUser.name
        }
      })
      
      // Listen for call status changes
      const unsubscribe = onSnapshot(doc(db, 'calls', callId), (snapshot) => {
        const data = snapshot.data()
        if (data?.status === 'accepted') {
          setCallStatus('connected')
          startCall()
        } else if (data?.status === 'declined' || data?.status === 'ended') {
          setCallStatus('ended')
          onEndCall()
        }
      })
      
      return unsubscribe
    } catch (error) {
      console.error('Error creating call request:', error)
    }
  }

  const startCall = async () => {
    try {
      // Get local stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      setLocalStream(stream)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // Create peer connection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      })
      peerConnection.current = pc

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream)
      })

      // Handle incoming stream
      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0])
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0]
        }
      }

      // Handle and send ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          updateDoc(doc(db, 'calls', callId), {
            candidates: arrayUnion(event.candidate.toJSON())
          })
        }
      }

      // Create and send offer
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      await setDoc(doc(db, 'calls', callId), {
        offer: { type: offer.type, sdp: offer.sdp },
        createdBy: currentUser.uid
      })

      // Listen for answer and candidates
      onSnapshot(doc(db, 'calls', callId), async (snapshot) => {
        const data = snapshot.data()
        if (!pc.currentRemoteDescription && data?.answer) {
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer))
        }
        if (data?.candidates) {
          data.candidates.forEach(async (candidate: RTCIceCandidateInit) => {
            if (!pc.remoteDescription) return
            await pc.addIceCandidate(new RTCIceCandidate(candidate))
          })
        }
      })
    } catch (error) {
      console.error('Error starting call:', error)
    }
  }

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setIsVideoOff(!isVideoOff)
    }
  }

  const endCall = async () => {
    cleanup()
    await deleteDoc(doc(db, 'calls', callId))
    onEndCall()
  }

  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
    }
    if (peerConnection.current) {
      peerConnection.current.close()
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Call with {otherUser.name}
        </CardTitle>
      </CardHeader>
      {callStatus === 'requesting' && !isDoctor && (
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Phone className="h-12 w-12 mx-auto mb-4 text-teal-600 animate-pulse" />
            <p>Waiting for {otherUser.name} to accept the call...</p>
          </div>
        </CardContent>
      )}
      {callStatus === 'connected' && (
        <CardContent className="flex-1 grid grid-cols-2 gap-4 p-4">
          <div className="relative">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-lg"
            />
            <p className="absolute bottom-2 left-2 text-white text-sm">You</p>
          </div>
          <div className="relative">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-lg"
            />
            <p className="absolute bottom-2 left-2 text-white text-sm">
              {otherUser.name}
            </p>
          </div>
        </CardContent>
      )}
      <div className="p-4 border-t flex justify-center gap-4">
        <Button
          variant={isMuted ? "destructive" : "default"}
          size="icon"
          onClick={toggleMute}
        >
          {isMuted ? <MicOff /> : <Mic />}
        </Button>
        <Button
          variant={isVideoOff ? "destructive" : "default"}
          size="icon"
          onClick={toggleVideo}
        >
          {isVideoOff ? <VideoOff /> : <Video />}
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={endCall}
        >
          <PhoneOff />
        </Button>
      </div>
    </Card>
  )
} 