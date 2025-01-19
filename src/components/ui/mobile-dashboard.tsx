import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, Stethoscope, MessageSquare, FileText, Upload, Download, Edit2, Check, X } from 'lucide-react'
import DoctorList from "@/components/ui/doctor-list"
import PrescriptionViewer from "@/components/ui/prescription-viewer"

export default function MobileDashboard({ activeTab, setActiveTab, isEditing, userInfo, handleEdit, handleSave, handleCancel, handleChange }:any) {
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* User Info Card */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">Personal Information</CardTitle>
                {!isEditing ? (
                  <Button variant="ghost" size="icon" onClick={handleEdit} className="text-teal-500">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={handleSave} className="text-teal-500">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleCancel} className="text-red-500">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={userInfo.avatar} />
                      <AvatarFallback>{userInfo.name[0]}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" className="text-teal-500">
                      Change Photo
                    </Button>
                  </div>
                  <div className="flex-1 grid gap-4">
                    {isEditing ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={userInfo.name}
                            onChange={handleChange}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            name="age"
                            value={userInfo.age}
                            onChange={handleChange}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="sex">Sex</Label>
                          <select
                            id="sex"
                            name="sex"
                            value={userInfo.sex}
                            onChange={handleChange}
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors mt-1"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="prefer not to say">Prefer not to say</option>
                          </select>

                        </div>
                        <div>
                          <Label htmlFor="height">Height (cm)</Label>
                          <Input
                            id="height"
                            name="height"
                            value={userInfo.height}
                            onChange={handleChange}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input
                            id="weight"
                            name="weight"
                            value={userInfo.weight}
                            onChange={handleChange}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        <p className="text-lg font-medium">{userInfo.name}</p>
                        <div className="grid sm:grid-cols-2 gap-2 text-gray-600">
                          <p>Age: {userInfo.age} years</p>
                          <p>Sex: {userInfo.sex}</p>
                          <p>Height: {userInfo.height} cm</p>
                          <p>Weight: {userInfo.weight} kg</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical History Card */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-medium">Medical History</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Button className="bg-teal-500 hover:bg-teal-600">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Medical Records
                  </Button>
                  <Button variant="outline" className="text-teal-500">
                    <Download className="mr-2 h-4 w-4" />
                    Download All Data
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  Supported formats: PDF, JPG, PNG (max 10MB)
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case 'diagnosis':
        return (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-medium">Recent Diagnoses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">No recent diagnoses to display.</p>
            </CardContent>
          </Card>
        )
      case 'chat':
        return (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-medium">Find a Doctor</CardTitle>
            </CardHeader>
            <CardContent>
              <DoctorList />
            </CardContent>
          </Card>
        )
      case 'prescriptions':
        return <PrescriptionViewer />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content Area */}
      <ScrollArea className="h-[100vh] pb-20">
        <div className="max-w-3xl mx-auto p-6">
          {renderContent()}
        </div>
      </ScrollArea>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto flex justify-around items-center p-4">
          <Button
            variant="ghost"
            className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-teal-500' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center gap-1 ${activeTab === 'diagnosis' ? 'text-teal-500' : ''}`}
            onClick={() => setActiveTab('diagnosis')}
          >
            <Stethoscope className="h-5 w-5" />
            <span className="text-xs">Diagnosis</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center gap-1 ${activeTab === 'chat' ? 'text-teal-500' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">Chat</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center gap-1 ${activeTab === 'prescriptions' ? 'text-teal-500' : ''}`}
            onClick={() => setActiveTab('prescriptions')}
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs">Rx</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

