'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X } from 'lucide-react'

interface PlanFeature {
  name: string
  basic: boolean | string
  basicPlus: boolean | string
}

const features: PlanFeature[] = [
  { name: "Ad-free Experience", basic: true, basicPlus: true },
  { name: "Video Calls with Doctors", basic: "10/month", basicPlus: "Unlimited" },
  { name: "Chat with Doctors", basic: "Unlimited", basicPlus: "Unlimited" },
  { name: "Prescription Storage", basic: "10/month", basicPlus: "Unlimited" },
  { name: "Priority Support", basic: false, basicPlus: true },
  { name: "Family Account Support", basic: false, basicPlus: true },
]

export default function PremiumPlans() {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'basicPlus' | null>(null)

  const handleSubscribe = (plan: 'basic' | 'basicPlus') => {
    setSelectedPlan(plan)
    // Add your subscription logic here
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-teal-800">Premium Plans</CardTitle>
          <CardDescription>Choose the plan that best fits your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Plan */}
            <Card className={`border-2 ${selectedPlan === 'basic' ? 'border-teal-500' : 'border-gray-200'}`}>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-teal-800">Basic Plan</CardTitle>
                <CardDescription>Perfect for occasional consultations</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-teal-800">₹199</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {features.map((feature) => (
                    <li key={feature.name} className="flex items-center gap-2">
                      {feature.basic ? (
                        <Check className="h-5 w-5 text-teal-500" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-gray-700">
                        {feature.name}
                        {typeof feature.basic === 'string' && (
                          <span className="text-sm text-teal-600 ml-1">
                            ({feature.basic})
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-6 bg-teal-600 hover:bg-teal-700"
                  onClick={() => handleSubscribe('basic')}
                >
                  Subscribe to Basic
                </Button>
              </CardContent>
            </Card>

            {/* Basic+ Plan */}
            <Card className={`border-2 ${selectedPlan === 'basicPlus' ? 'border-teal-500' : 'border-gray-200'}`}>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-teal-800">Basic+ Plan</CardTitle>
                <CardDescription>For unlimited access to all features</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-teal-800">₹999</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {features.map((feature) => (
                    <li key={feature.name} className="flex items-center gap-2">
                      {feature.basicPlus ? (
                        <Check className="h-5 w-5 text-teal-500" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-gray-700">
                        {feature.name}
                        {typeof feature.basicPlus === 'string' && (
                          <span className="text-sm text-teal-600 ml-1">
                            ({feature.basicPlus})
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-6 bg-teal-600 hover:bg-teal-700"
                  onClick={() => handleSubscribe('basicPlus')}
                >
                  Subscribe to Basic+
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 