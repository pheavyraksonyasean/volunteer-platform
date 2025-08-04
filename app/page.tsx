import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Heart, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="bg-pink-800 text-white p-4 rounded">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">
                Sabay Volunteer
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#features" className="text-white hover:text-pink-950">
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-white hover:text-pink-950"
              >
                How it Works
              </Link>
              <Link
                href="#testimonials"
                className="text-white hover:text-pink-950"
              >
                Success Stories
              </Link>
              <Link href="#about" className="text-white hover:text-pink-950">
                About
              </Link>
            </nav>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="bg-pink-800 border-white text-white hover:bg-pink-900 hover:border-white"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className=" bg-pink-950 text-white">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
              Connect Volunteers with Meaninfull
            </h1>
            <p className="text-xl text-pink-800 mb-8 max-w-3xl mx-auto">
              Join thousands of volunteers and organizations making a difference
              in their communities. Find opportunities that match your skills
              and passion, or post opportunities to find dedicated volunteers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?role=volunteer">
                <Button size="lg" className="bg-pink-950 text-white">
                  I'm a Volunteer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register?role=organization">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white border-pink-800 text-pink-800 hover:bg-pink-900 hover:border-white"
                >
                  I'm an Organization
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}

      {/* Features Section */}

      {/* How it Works Section */}

      {/* Testimonials Section */}

      {/* CTA Section
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join our community today and start connecting with meaningful
            volunteer opportunities or find dedicated volunteers for your cause.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/opportunities">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-indigo-600 bg-transparent"
              >
                Browse Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </section> */}

      <div className="flex-1">
        {/* Place all your main content here (header, hero, etc.) */}
        {/* ...existing code up to before <footer>... */}
      </div>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-800 mt-4 pt-4 text-center">
            <p>&copy; 2024 VolunteerMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
