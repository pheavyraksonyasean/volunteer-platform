"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Heart, Search, SlidersHorizontal, Zap } from "lucide-react"
import OpportunityCard from "@/components/opportunity-card"

// Mock data for opportunities
const mockOpportunities = [
  {
    id: 1,
    title: "Food Bank Volunteer",
    organization: "Community Food Bank",
    location: "Downtown, NY",
    date: "Dec 15, 2024",
    time: "9:00 AM - 1:00 PM",
    volunteers: 12,
    maxVolunteers: 20,
    skills: ["Physical Work", "Customer Service", "Organization"],
    category: "Hunger Relief",
    description:
      "Help sort and distribute food to families in need. This is a great opportunity to make a direct impact in your community by ensuring families have access to nutritious meals during the holiday season.",
    image: "/placeholder.svg?height=200&width=300",
    urgent: false,
  },
  {
    id: 2,
    title: "Beach Cleanup",
    organization: "Ocean Conservation Society",
    location: "Santa Monica Beach, CA",
    date: "Dec 18, 2024",
    time: "8:00 AM - 12:00 PM",
    volunteers: 47,
    maxVolunteers: 50,
    skills: ["Environmental", "Physical Work", "Teamwork"],
    category: "Environment",
    description:
      "Join us for a morning of beach cleanup and environmental education. Help protect marine life and keep our beaches clean while learning about ocean conservation and sustainable practices.",
    image: "/placeholder.svg?height=200&width=300",
    urgent: true,
  },
  {
    id: 3,
    title: "Reading Tutor",
    organization: "City Library",
    location: "Central Library, NY",
    date: "Dec 20, 2024",
    time: "3:00 PM - 5:00 PM",
    volunteers: 8,
    maxVolunteers: 15,
    skills: ["Teaching", "Childcare", "Communication"],
    category: "Education",
    description:
      "Help children improve their reading skills through one-on-one tutoring. Make a lasting impact on a child's education and help build their confidence in reading and learning.",
    image: "/placeholder.svg?height=200&width=300",
    urgent: false,
  },
  {
    id: 4,
    title: "Senior Center Helper",
    organization: "Golden Years Community Center",
    location: "Midtown, NY",
    date: "Dec 22, 2024",
    time: "10:00 AM - 2:00 PM",
    volunteers: 6,
    maxVolunteers: 12,
    skills: ["Elder Care", "Social Skills", "Patience"],
    category: "Senior Care",
    description:
      "Spend time with seniors, help with activities, and provide companionship. Bring joy to elderly community members through games, conversations, and assistance with daily activities.",
    image: "/placeholder.svg?height=200&width=300",
    urgent: false,
  },
  {
    id: 5,
    title: "Animal Shelter Assistant",
    organization: "Happy Paws Animal Shelter",
    location: "Westside, CA",
    date: "Dec 25, 2024",
    time: "9:00 AM - 1:00 PM",
    volunteers: 18,
    maxVolunteers: 20,
    skills: ["Animal Care", "Physical Work", "Compassion"],
    category: "Animal Welfare",
    description:
      "Help care for rescued animals, assist with feeding, cleaning, and providing love to animals in need. Experience the joy of helping animals find their forever homes.",
    image: "/placeholder.svg?height=200&width=300",
    urgent: true,
  },
  {
    id: 6,
    title: "Holiday Gift Wrapping",
    organization: "Children's Hospital Foundation",
    location: "Children's Hospital, NY",
    date: "Dec 23, 2024",
    time: "1:00 PM - 5:00 PM",
    volunteers: 15,
    maxVolunteers: 25,
    skills: ["Creativity", "Customer Service", "Event Planning"],
    category: "Healthcare",
    description:
      "Help wrap holiday gifts for children in the hospital. Bring smiles to young patients and their families during the holiday season with beautifully wrapped presents.",
    image: "/placeholder.svg?height=200&width=300",
    urgent: false,
  },
]

const categories = [
  "All",
  "Hunger Relief",
  "Environment",
  "Education",
  "Senior Care",
  "Animal Welfare",
  "Healthcare",
  "Community",
]
const skills = [
  "Physical Work",
  "Customer Service",
  "Environmental",
  "Teaching",
  "Childcare",
  "Elder Care",
  "Social Skills",
  "Animal Care",
  "Organization",
  "Teamwork",
  "Communication",
  "Creativity",
]
const locations = ["All Locations", "New York", "California", "Downtown", "Midtown", "Westside"]

export default function OpportunitiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [showUrgentOnly, setShowUrgentOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("date")
  const [applications, setApplications] = useState<{ [key: number]: any }>({})

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const handleApply = (opportunityId: number, applicationData: any) => {
    setApplications((prev) => ({
      ...prev,
      [opportunityId]: applicationData,
    }))
    console.log("Application submitted:", { opportunityId, applicationData })
  }

  const filteredOpportunities = mockOpportunities.filter((opportunity) => {
    const matchesSearch =
      opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "All" || opportunity.category === selectedCategory

    const matchesLocation =
      selectedLocation === "All Locations" ||
      opportunity.location.includes(selectedLocation.replace("All Locations", ""))

    const matchesSkills =
      selectedSkills.length === 0 || selectedSkills.some((skill) => opportunity.skills.includes(skill))

    const matchesUrgent = !showUrgentOnly || opportunity.urgent

    return matchesSearch && matchesCategory && matchesLocation && matchesSkills && matchesUrgent
  })

  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    switch (sortBy) {
      case "urgent":
        return (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0)
      case "volunteers":
        return b.maxVolunteers - b.volunteers - (a.maxVolunteers - a.volunteers)
      case "location":
        return a.location.localeCompare(b.location)
      case "date":
      default:
        return new Date(a.date).getTime() - new Date(b.date).getTime()
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <Heart className="h-8 w-8 text-indigo-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">VolunteerMatch</span>
            </Link>

            <nav className="hidden md:flex space-x-8">
              <Link href="/opportunities" className="text-indigo-600 font-medium">
                Browse
              </Link>
              <Link href="/about" className="text-gray-500 hover:text-gray-900">
                About
              </Link>
              <Link href="/contact" className="text-gray-500 hover:text-gray-900">
                Contact
              </Link>
            </nav>

            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Join Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Volunteer Opportunities</h1>
          <p className="text-gray-600">Find meaningful ways to make a difference in your community</p>
        </div>

        {/* Featured/Urgent Opportunities Banner */}
        {mockOpportunities.some((op) => op.urgent) && (
          <Card className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Zap className="h-6 w-6 text-red-500 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-900">Urgent Opportunities</h3>
                    <p className="text-red-700">These opportunities need volunteers immediately!</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
                  onClick={() => setShowUrgentOnly(true)}
                >
                  View Urgent
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filter Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search opportunities, organizations, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant={showFilters ? "default" : "outline"}
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center relative"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Advanced Filters
                  {(selectedSkills.length > 0 || showUrgentOnly) && (
                    <Badge variant="secondary" className="ml-2 bg-red-100 text-red-800">
                      {selectedSkills.length + (showUrgentOnly ? 1 : 0)}
                    </Badge>
                  )}
                </Button>

                {/* Quick Filter Chips */}
                <div className="flex flex-wrap gap-1">
                  <Button
                    variant={showUrgentOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowUrgentOnly(!showUrgentOnly)}
                    className="h-8"
                  >
                    🚨 Urgent Only
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 bg-transparent">
                    📅 This Weekend
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 bg-transparent">
                    🏠 Remote
                  </Button>
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Skills Filter */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">Skills</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                      {skills.map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={skill}
                            checked={selectedSkills.includes(skill)}
                            onCheckedChange={() => handleSkillToggle(skill)}
                          />
                          <Label htmlFor={skill} className="text-sm">
                            {skill}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Other Filters */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">Preferences</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="urgent" checked={showUrgentOnly} onCheckedChange={setShowUrgentOnly} />
                        <Label htmlFor="urgent" className="text-sm">
                          Show urgent opportunities only
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="weekend" />
                        <Label htmlFor="weekend" className="text-sm">
                          Weekend opportunities only
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remote" />
                        <Label htmlFor="remote" className="text-sm">
                          Remote/Virtual opportunities
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedSkills.length > 0 ||
                  showUrgentOnly ||
                  selectedCategory !== "All" ||
                  selectedLocation !== "All Locations") && (
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSkills([])
                        setShowUrgentOnly(false)
                        setSelectedCategory("All")
                        setSelectedLocation("All Locations")
                        setSearchTerm("")
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Summary and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <p className="text-gray-600">
              Showing {sortedOpportunities.length} of {mockOpportunities.length} opportunities
            </p>
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                    <button onClick={() => handleSkillToggle(skill)} className="ml-1 hover:text-red-500">
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date (Earliest First)</SelectItem>
              <SelectItem value="urgent">Urgent First</SelectItem>
              <SelectItem value="volunteers">Most Spots Available</SelectItem>
              <SelectItem value="location">Location</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedOpportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} onApply={handleApply} />
          ))}
        </div>

        {/* No Results */}
        {sortedOpportunities.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters to find more opportunities.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All")
                  setSelectedLocation("All Locations")
                  setSelectedSkills([])
                  setShowUrgentOnly(false)
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}

        {/* Load More */}
        {sortedOpportunities.length > 0 && sortedOpportunities.length >= 6 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Opportunities
            </Button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-16 bg-white rounded-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Make Your Impact Today</h3>
            <p className="text-gray-600">Join thousands of volunteers making a difference</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {mockOpportunities.reduce((sum, op) => sum + (op.maxVolunteers - op.volunteers), 0)}
              </div>
              <div className="text-gray-600">Volunteer Spots Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {mockOpportunities.filter((op) => op.urgent).length}
              </div>
              <div className="text-gray-600">Urgent Opportunities</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {new Set(mockOpportunities.map((op) => op.organization)).size}
              </div>
              <div className="text-gray-600">Partner Organizations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
