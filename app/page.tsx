import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Heart, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="bg-pink-800 text-white ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">
                Sabay Volunteer
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
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
                About
              </Link>
              <Link href="#about" className="text-white hover:text-pink-950">
                Contact
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
                <Button className=" bg-rose-950 text-white">Get Started</Button>
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
                <Button size="lg" className="bg-rose-900 text-white">
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

      <div className="flex-1"></div>
      {/* Footer */}
      <footer className="bg-pink-800 text-white h-20 flex items-center justify-center">
        <p>&copy; 2024 VolunteerMatch. All rights reserved.</p>
      </footer>
    </div>
  );
}
