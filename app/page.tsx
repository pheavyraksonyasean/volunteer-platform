"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, Quote, Menu, X } from "lucide-react";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="bg-pink-800 text-white shadow-lg">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">
            <div className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="sabay volunteer"
                className="h-8 w-8 md:h-10 md:w-10"
              />
              <span className="text-lg md:text-2xl font-bold text-white font-serif">
                Sabay Volunteer
              </span>

              <span>
                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-8 lg:space-x-20 ml-10">
                  <Link
                    href="#impact"
                    className="text-white hover:text-pink-950 transition-colors font-sans"
                  >
                    Our Impact
                  </Link>
                  <Link
                    href="#testimonials"
                    className="text-white hover:text-pink-950 transition-colors font-sans"
                  >
                    Stories
                  </Link>
                  <Link
                    href="#about"
                    className="text-white hover:text-pink-950 transition-colors font-sans"
                  >
                    About
                  </Link>
                </nav>
              </span>
            </div>
            {/* Desktop Buttons */}
            <div className="hidden md:flex space-x-4">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-all duration-300 font-sans"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-pink-950 text-white hover:bg-black transition-all duration-300 font-sans font-semibold">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-pink-700 mt-4">
              <nav className="flex flex-col space-y-4 mt-4">
                <Link
                  href="#impact"
                  className="text-white hover:text-pink-950 transition-colors font-sans"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Our Impact
                </Link>
                <Link
                  href="#testimonials"
                  className="text-white hover:text-pink-950 transition-colors font-sans"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Stories
                </Link>
                <Link
                  href="#about"
                  className="text-white hover:text-pink-950 transition-colors font-sans"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
              </nav>
              <div className="flex flex-col space-y-3 mt-6">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-white text-white hover:bg-white hover:text-black transition-all duration-300 font-sans"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full bg-pink-950 text-white hover:bg-black transition-all duration-300 font-sans font-semibold">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-white from-green-600/10 to-lime-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <div className="mb-8 md:mb-16">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-black mb-6 md:mb-8 font-serif leading-tight">
                Join Us in Making a{" "}
                <span className="text-pink-900">Difference</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 max-w-4xl mx-auto font-sans leading-relaxed px-4">
                Together, we can create a brighter future for our community.
                Connect with meaningful volunteer opportunities and join
                thousands of changemakers making a real impact.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center animate-fade-in-up animate-delay-200 px-4">
              <Link href="/register?role=volunteer">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-pink-900 text-white hover:bg-black hover:scale-105 transition-all duration-300 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-sans font-semibold"
                >
                  Get Involved Today
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
              <Link href="/register?role=organization">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-pink-900 text-pink-900 hover:bg-pink-900 hover:text-white hover:scale-105 transition-all duration-300 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-sans font-semibold bg-transparent"
                >
                  I'm an Organizer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
            <h2 className="text-2xl md:text-4xl font-bold text-pink-900 mb-4 font-serif">
              Stories of Impact
            </h2>
            <p className="text-lg md:text-xl text-gray-600 font-sans">
              Hear from our amazing volunteer community
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 animate-fade-in-up animate-delay-200">
            <Card className="p-6 md:p-8 border-pink-600 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <Quote className="h-6 w-6 md:h-8 md:w-8 text-pink-600 mb-4" />
                <p className="text-gray-700 mb-6 font-sans italic text-base md:text-lg">
                  "Volunteering with Sabay changed my life! I've met incredible
                  people and made a real difference in my community."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-pink-950 font-bold font-sans text-sm md:text-base">
                      P
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-pink-950 font-sans text-sm md:text-base">
                      Sarah Martinez
                    </p>
                    <p className="text-gray-600 font-sans text-xs md:text-sm">
                      Community Volunteer
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="p-6 md:p-8 border-pink-600 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <Quote className="h-6 w-6 md:h-8 md:w-8 text-pink-600 mb-4" />
                <p className="text-gray-700 mb-6 font-sans italic text-base md:text-lg">
                  "The platform made it so easy to find volunteers for our food
                  drive. We reached more people than ever before!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-pink-950 font-bold font-sans text-sm md:text-base">
                      DJ
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-pink-950 font-sans text-sm md:text-base">
                      David Johnson
                    </p>
                    <p className="text-gray-600 font-sans text-xs md:text-sm">
                      Local Food Bank Director
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-12 md:py-20 bg-white border-pink-100 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
        <div className="absolute top-20 right-10 w-32 h-32 bg-pink-200/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-purple-200/30 rounded-full blur-2xl animate-pulse delay-1000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
            <div className="flex justify-center mb-4"></div>
            <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-pink-900 mb-4 font-serif">
              About Sabay Volunteer
            </h2>
            <p className="text-lg md:text-xl text-gray-600 font-sans max-w-3xl mx-auto">
              Connecting hearts, building communities, and creating lasting
              change through the power of volunteering
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-16">
            <div className="animate-fade-in-up">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6 font-serif">
                Our Mission
              </h3>
              <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 font-sans leading-relaxed">
                Sabay Volunteer was born from a simple belief: everyone has the
                power to make a difference. We bridge the gap between passionate
                volunteers and meaningful opportunities, creating a vibrant
                ecosystem where communities thrive.
              </p>
              <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 font-sans leading-relaxed">
                Whether you're looking to give back, develop new skills, or
                connect with like-minded individuals, our platform makes
                volunteering accessible, rewarding, and impactful for everyone.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 md:h-6 md:w-6 text-pink-900" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base">
                    Community First
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    Building stronger communities together
                  </p>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in-up animate-delay-200">
              <div className="bg-pink-50 rounded-2xl p-6 md:p-8 shadow-lg">
                <img
                  src="/about.png"
                  alt="Volunteers working together"
                  className="w-full h-48 md:h-64 object-cover rounded-xl shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-pink-950 text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Brand */}
            <div className="flex items-center space-x-2">
              <span className="text-lg md:text-xl font-bold font-serif">
                Sabay Volunteer
              </span>
            </div>

            {/* Right side: Social + Copyright */}
            <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-4 md:space-y-0">
              {/* Social Icons */}
              <div className="flex space-x-6">
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  className="hover:text-pink-300 transition"
                >
                  <Facebook className="w-5 h-5 md:w-6 md:h-6" />
                </Link>
                <Link
                  href="https://twitter.com"
                  target="_blank"
                  className="hover:text-pink-300 transition"
                >
                  <Twitter className="w-5 h-5 md:w-6 md:h-6" />
                </Link>
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  className="hover:text-pink-300 transition"
                >
                  <Instagram className="w-5 h-5 md:w-6 md:h-6" />
                </Link>
              </div>

              {/* Copyright */}
              <p className="text-xs md:text-sm text-gray-300 text-center md:text-left">
                &copy; {new Date().getFullYear()} Sabay Volunteer. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
