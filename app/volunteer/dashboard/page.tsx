"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProfileMenu from "@/components/ProfileMenu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Clock,
  Calendar,
  Users,
  Star,
  Bell,
  Award,
  Target,
} from "lucide-react";
import OpportunityCard from "@/components/opportunity-card";

// Mock data
const mockOpportunities = [
  {
    id: 1,
    title: "Angkor Temple Cleanup Volunteer",
    organization: "APSARA Authority",
    location: "Angkor Archaeological Park, Siem Reap, Cambodia",
    date: "Sep 22, 2025",
    time: "7:30 AM – 11:30 AM",
    volunteers: 30,
    maxVolunteers: 50,
    skills: ["Environmental", "Teamwork"],
    category: "Environment",
    description:
      "Join local communities and volunteers to help clean up the Angkor temple complex and preserve Cambodia’s cultural heritage.",
    image: "https://www.khmertimeskh.com/wp-content/uploads/2024/06/250604.jpg",
  },
  {
    id: 2,
    title: "Plastic-Free Cambodia Volunteer",
    organization: "Plastic-Free Cambodia Initiative",
    location: "Phnom Penh, Cambodia",
    date: "Oct 05, 2025",
    time: "8:00 AM – 1:00 PM",
    volunteers: 20,
    maxVolunteers: 40,
    skills: ["Awareness Campaigning", "Environmental"],
    category: "Environment",
    description:
      "Support Cambodia’s plastic-free movement by raising awareness, distributing reusable bags, and joining city-wide cleanup activities.",
    image:
      "https://cdn.kiripost.com/static/images/Nisset_Plastic-Watermark-Mon_Sokeo_3.width-960.jpg",
  },
  {
    id: 3,
    title: "Blood Donation Drive Volunteer",
    organization: "Cambodian Red Cross",
    location: "Phnom Penh, Cambodia",
    date: "Aug 30, 2025",
    time: "9:00 AM – 3:00 PM",
    volunteers: 15,
    maxVolunteers: 25,
    skills: ["Health Support", "Organization"],
    category: "Health",
    description:
      "Assist in organizing a blood donation drive, helping donors through registration, guidance, and post-donation care.",
    image:
      "https://www.khmertimeskh.com/wp-content/uploads/2022/10/46508-750x440.jpg",
  },
  {
    id: 4,
    title: "Computer Skills Trainer",
    organization: "CYA Learning Center",
    location: "Kampong Cham, Cambodia",
    date: "Sep 10, 2025",
    time: "1:00 PM – 5:00 PM",
    volunteers: 5,
    maxVolunteers: 10,
    skills: ["Teaching", "Computer Literacy"],
    category: "Education",
    description:
      "Teach basic computer skills such as Word, Excel, and internet use to local youth and community members.",
    image: "https://www.khmertimeskh.com/wp-content/uploads/2024/04/80642.jpg",
  },
];

const mockUpcomingEvents = [
  {
    id: 1,
    title: "Animal Shelter Helper",
    organization: "Happy Paws Shelter",
    date: "Dec 22, 2024",
    time: "10:00 AM - 2:00 PM",
    location: "123 Pet Street, NY",
    status: "confirmed",
  },
];

export default function VolunteerDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [applications, setApplications] = useState<
    Array<{
      id: number;
      opportunityId: number;
      title: string;
      organization: string;
      status: "pending" | "approved" | "rejected";
      appliedDate: string;
      eventDate: string;
      message: string;
      applicationData: any;
    }>
  >([
    {
      id: 1,
      opportunityId: 999,
      title: "Homeless Shelter Volunteer",
      organization: "Hope Center",
      status: "pending",
      appliedDate: "Dec 5, 2024",
      eventDate: "Dec 25, 2024",
      message: "Application under review. You'll hear back within 2-3 days.",
      applicationData: {},
    },
  ]);

  const [profileImage, setProfileImage] = useState(
    "/placeholder.svg?height=32&width=32"
  );
  const [mockUser, setMockUser] = useState({
    name: "user",
    email: "user001@gmail.com",
    bio: "papipapipu",
    phone: "(+855) 964853340",
    location: "KIRIROM",
    skills: ["Teaching", "Environmental"],
    experience: "2 years of volunteer experience",
    availability: "Weekends and evenings",
  });

  const handleApply = (opportunityId: number, applicationData: any) => {
    const opportunity = mockOpportunities.find(
      (opp) => opp.id === opportunityId
    );
    if (!opportunity) return;

    const newApplication = {
      id: Date.now(), // Simple ID generation
      opportunityId,
      title: opportunity.title,
      organization: opportunity.organization,
      status: "pending" as const,
      appliedDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      eventDate: opportunity.date,
      message:
        "Application submitted successfully. You'll hear back within 2-3 business days.",
      applicationData,
    };

    setApplications((prev) => [newApplication, ...prev]);
    console.log("Application submitted:", newApplication);
  };

  const filteredOpportunities = mockOpportunities.filter((opportunity) => {
    const matchesSearch =
      opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.organization.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalHours = 124;
  const monthlyGoal = 20;
  const currentMonthHours = 24;
  const progressPercentage = (currentMonthHours / monthlyGoal) * 100;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-pink-800 shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-4">
            <div className="flex items-center min-w-0 flex-1">
              <Link href="/" className="flex items-center min-w-0">
                <img
                  src="/logo.png"
                  alt="sabay volunteer"
                  className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 flex-shrink-0"
                />
                <span className="text-sm sm:text-lg md:text-2xl font-bold text-white font-serif ml-1 sm:ml-2 truncate">
                  Sabay Volunteer
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 flex-shrink-0">
              <Button variant="ghost" size="sm" className="relative p-1 sm:p-2">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-2 w-2 md:h-3 md:w-3 bg-red-500 rounded-full"></span>
              </Button>
              <ProfileMenu
                profileImage={profileImage}
                setProfileImage={setProfileImage}
                mockUser={mockUser}
                setMockUser={setMockUser}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Welcome back !!
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Ready to make a difference today? You're doing amazing work!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card className="bg-pink-50 border-pink-800 white text-black">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-black">Total Hours</p>
                  <p className="text-xl md:text-3xl font-bold text-black">
                    {totalHours}
                  </p>
                </div>
                <Clock className="h-6 w-6 md:h-8 md:w-8 text-black" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-pink-50 border-pink-800 white text-black">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">
                    This Month
                  </p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">
                    {currentMonthHours}h
                  </p>
                  <div className="mt-1 md:mt-2">
                    <Progress
                      value={progressPercentage}
                      className="h-1 md:h-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {currentMonthHours}/{monthlyGoal} hours goal
                    </p>
                  </div>
                </div>
                <Target className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-pink-50 border-pink-800 white text-black">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">
                    Events Completed
                  </p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">
                    12
                  </p>
                  <p className="text-xs text-green-600 mt-1">+3 this month</p>
                </div>
                <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-pink-50 border-pink-800 white text-black">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">
                    Impact Score
                  </p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">
                    95
                  </p>
                  <div className="flex items-center mt-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <p className="text-xs text-gray-500 ml-1">Excellent</p>
                  </div>
                </div>
                <Award className="h-5 w-5 md:h-6 md:w-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4 md:space-y-6"
        >
          <div className="overflow-x-auto">
            <TabsList className="bg-pink-50 grid w-full grid-cols-4 min-w-max md:min-w-0">
              <TabsTrigger
                value="overview"
                className="text-xs md:text-sm px-2 md:px-4"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="opportunities"
                className="text-xs md:text-sm px-2 md:px-4"
              >
                Find Opportunities
              </TabsTrigger>
              <TabsTrigger
                value="applications"
                className="text-xs md:text-sm px-2 md:px-4"
              >
                My Applications
              </TabsTrigger>
              <TabsTrigger
                value="schedule"
                className="text-xs md:text-sm px-2 md:px-4"
              >
                My Schedule
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-4 md:space-y-6">
                {/* Recent Activity */}
                <Card className="border-pink-200">
                  <CardHeader className="pb-3 md:pb-6">
                    <CardTitle className="text-lg md:text-xl">
                      Recent Activity
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base">
                      Your latest volunteer activities and updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Application approved!
                          </p>
                          <p className="text-xs text-gray-500">
                            Your application for Animal Shelter Helper was
                            approved
                          </p>
                          <p className="text-xs text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            New opportunity match
                          </p>
                          <p className="text-xs text-gray-500">
                            3 new opportunities match your skills
                          </p>
                          <p className="text-xs text-gray-400">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Volunteer hours logged
                          </p>
                          <p className="text-xs text-gray-500">
                            4 hours added to your profile
                          </p>
                          <p className="text-xs text-gray-400">3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommended Opportunities */}
                <Card className="border-pink-200">
                  <CardHeader className="pb-3 md:pb-6">
                    <CardTitle className="text-lg md:text-xl">
                      Recommended for You
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base">
                      Opportunities that match your skills and interests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:gap-4">
                      {mockOpportunities.slice(0, 3).map((opportunity) => (
                        <OpportunityCard
                          key={opportunity.id}
                          opportunity={opportunity}
                          onApply={handleApply}
                        />
                      ))}
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        className="w-full bg-pink-900 text-white hover:bg-pink-800 text-sm md:text-base"
                        onClick={() => setActiveTab("opportunities")}
                      >
                        View All Opportunities
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-4 md:space-y-6">
                {/* Upcoming Events */}
                <Card className="border-pink-200">
                  <CardHeader className="pb-3 md:pb-6">
                    <CardTitle className="text-lg md:text-xl">
                      Upcoming Events
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base">
                      Your confirmed volunteer activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 md:space-y-4">
                      {mockUpcomingEvents.map((event) => (
                        <div
                          key={event.id}
                          className="border-l-4 border-pink-600 pl-4"
                        >
                          <h4 className="font-medium text-gray-900 text-sm md:text-base">
                            {event.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {event.organization}
                          </p>
                          <p className="text-xs text-gray-500">
                            {event.date} • {event.time}
                          </p>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {event.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-4 bg-transparent bg-pink-800 text-white text-sm md:text-base"
                      onClick={() => setActiveTab("schedule")}
                    >
                      View Full Calendar
                    </Button>
                  </CardContent>
                </Card>

                {/* Application Status */}
                <Card className="border-pink-200">
                  <CardHeader className="pb-3 md:pb-6">
                    <CardTitle className="text-lg md:text-xl">
                      Application Status
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base">
                      Track your recent applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {applications.slice(0, 3).map((application) => (
                        <div
                          key={application.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {application.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {application.organization}
                            </p>
                          </div>
                          <Badge
                            variant={
                              application.status === "approved"
                                ? "default"
                                : application.status === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                            className="ml-2 text-xs"
                          >
                            {application.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-4 bg-transparent bg-pink-800 text-white text-sm md:text-base"
                      onClick={() => setActiveTab("applications")}
                    >
                      View All Applications
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-4 md:space-y-6">
            {/* Search and Filters */}
            <Card className="border-pink-200">
              <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="text-lg md:text-xl">
                  Find Opportunities
                </CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Discover volunteer opportunities that match your interests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-pink-300 flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="border-pink-300 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search opportunities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 text-sm md:text-base"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opportunities List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  onApply={handleApply}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4 md:space-y-6">
            <Card className="border-pink-200">
              <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="text-lg md:text-xl">
                  My Applications
                </CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Track all your volunteer applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-6 md:py-8">
                    <p className="text-gray-500 mb-4 text-sm md:text-base">
                      No applications yet
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("opportunities")}
                      className="text-sm md:text-base"
                    >
                      Browse Opportunities
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    {applications.map((application) => (
                      <Card key={application.id}>
                        <CardContent className="p-3 md:p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                                  {application.title}
                                </h4>
                                <p className="text-sm text-pink-800">
                                  {application.organization}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Applied: {application.appliedDate} • Event:{" "}
                                  {application.eventDate}
                                </p>
                                <p className="text-sm text-gray-700 mt-2">
                                  {application.message}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                application.status === "approved"
                                  ? "default"
                                  : application.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                              }
                              className="ml-2 text-xs"
                            >
                              {application.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4 md:space-y-6">
            <Card className="border-pink-200">
              <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="text-lg md:text-xl">
                  My Schedule
                </CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Your upcoming volunteer commitments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 md:space-y-4">
                  {mockUpcomingEvents.map((event) => (
                    <Card key={event.id}>
                      <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Calendar className="h-5 w-5 md:h-6 md:w-6 text-pink-900" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm md:text-base">
                                {event.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {event.organization}
                              </p>
                              <p className="text-xs text-gray-500">
                                {event.date} • {event.time}
                              </p>
                              <p className="text-xs text-gray-500">
                                {event.location}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {event.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
