import { Button } from "../components/ui/button"
import { MessageCircle, Book, Calendar, Apple } from 'lucide-react'
import Image from "next/image"
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-teal-50 text-teal-900">
      <header className="bg-teal-600 text-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image src="/logo.svg" alt="CureSphere Logo" width={32} height={32} />
            <span className="text-2xl font-bold">CureSphere</span>
          </div>
          <nav className="hidden md:flex space-x-4">
            <a href="#features" className="hover:text-teal-200 transition-colors">Features</a>
            <a href="#about" className="hover:text-teal-200 transition-colors">About</a>
            <a href="/signup" className="hover:text-teal-200 transition-colors">Signup/Signin</a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-teal-600 to-teal-500 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Your Personal Health Guide
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                CureSphere: AI-powered healthcare in your pocket. Get personalized health insights and connect with professionals instantly.
              </p>
              <Link href="/signup">
                <Button size="lg" className="bg-white text-teal-600 hover:bg-teal-100">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How can I help you today? Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How can I help you today?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<MessageCircle className="w-12 h-12 text-teal-600" />}
                title="Chat with AI"
                description="Get instant answers to your health questions from our AI-powered chatbot."
              />
              <FeatureCard
                icon={<Book className="w-12 h-12 text-teal-600" />}
                title="Health Journal"
                description="Keep track of your symptoms, mood, and overall well-being with our easy-to-use health journal."
              />
              <FeatureCard
                icon={<Calendar className="w-12 h-12 text-teal-600" />}
                title="Health Plans"
                description="Receive personalized health plans tailored to your unique needs and goals."
              />
              <FeatureCard
                icon={<Apple className="w-12 h-12 text-teal-600" />}
                title="Apple a Day"
                description="Get daily health tips and advice to keep you on track with your wellness journey."
              />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h2 className="text-3xl font-bold mb-4">About CureSphere</h2>
                <p className="text-lg mb-4">
                  CureSphere is revolutionizing healthcare by combining artificial intelligence with personalized care. Our platform offers:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>24/7 access to AI-powered health assessments</li>
                  <li>Detailed and customized feedback on your health concerns</li>
                  <li>Easy-to-use health tracking tools</li>
                  <li>Personalized health plans and insights</li>
                </ul>
              </div>
              <div className="md:w-1/2">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="CureSphere App Interface"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-teal-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Start Your Health Journey Today</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join CureSphere and experience the future of personalized healthcare. Our AI-powered platform is here to support your well-being every step of the way.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-white text-teal-600 hover:bg-teal-100">
                Download Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-teal-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2025 CureSphere. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-teal-200 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-teal-200 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-teal-200 transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }:any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg transition-transform hover:scale-105">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
