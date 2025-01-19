import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Home, Stethoscope, MessageSquare, FileText, Upload, Download, Edit2, Check, X } from 'lucide-react'
import DoctorList from "@/components/ui/doctor-list"

export default function DesktopDashboard({ activeTab, setActiveTab, isEditing, userInfo, handleEdit, handleSave, handleCancel, handleChange }:any) {
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
                <div className="flex gap-6">
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
                      <div className="grid gap-4 grid-cols-3">
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
                      <div className="grid gap-2 grid-cols-3">
                        <p className="text-lg font-medium col-span-3">{userInfo.name}</p>
                        <p className="text-gray-600">Age: {userInfo.age} years</p>
                        <p className="text-gray-600">Sex: {userInfo.sex}</p>
                        <p className="text-gray-600">Height: {userInfo.height} cm</p>
                        <p className="text-gray-600">Weight: {userInfo.weight} kg</p>
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
                <div className="grid grid-cols-2 gap-4">
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
      case 'prescription':
        return (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-medium">Current Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">No active prescriptions.</p>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex flex-col items-center mb-8">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={userInfo.avatar} />
            <AvatarFallback>{userInfo.name[0]}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">{userInfo.name}</h2>
        </div>
        <nav className="space-y-2">
          <Button
            variant="ghost"
            className={`w-full justify-start ${activeTab === 'dashboard' ? 'bg-teal-100 text-teal-800' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Home className="mr-2 h-5 w-5" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start ${activeTab === 'diagnosis' ? 'bg-teal-100 text-teal-800' : ''}`}
            onClick={() => setActiveTab('diagnosis')}
          >
            <Stethoscope className="mr-2 h-5 w-5" />
            Diagnosis
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start ${activeTab === 'chat' ? 'bg-teal-100 text-teal-800' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Chat
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start ${activeTab === 'prescription' ? 'bg-teal-100 text-teal-800' : ''}`}
            onClick={() => setActiveTab('prescription')}
          >
            <FileText className="mr-2 h-5 w-5" />
            Prescriptions
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

