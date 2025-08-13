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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Plus,
  Users,
  Calendar,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

import CreateOpportunityModal from "@/components/create-opportunity-modal";

export default function OrganizationDashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleCreateOpportunity = (opportunityData: any) => {
    console.log("New opportunity created:", opportunityData);
    // Here you would typically send the data to your backend
    setShowCreateModal(false);
  };

  const handleApplicationAction = (
    applicationId: number,
    action: "approve" | "reject"
  ) => {
    console.log(`${action} application ${applicationId}`);
    // Here you would update the application status
  };

  // Mock data
  const mockOpportunities = [
    {
      id: 1,
      title: "Food Bank Volunteer",
      date: "Dec 15, 2024",
      time: "9:00 AM - 1:00 PM",
      volunteers: 12,
      maxVolunteers: 20,
      applications: 25,
      status: "active",
    },
  ];

  const mockApplications = [
    {
      id: 1,
      volunteerName: "Sean Pheavyraksonya",
      opportunity: "Food Bank Volunteer",
      appliedDate: "Dec 1, 2025",
      status: "pending",
      skills: ["Customer Service", "Physical Work"],
      experience: "2 years volunteering at local shelter",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-pink-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Sabay Volunteer</h1>
            </Link>

            <div className="flex items-center space-x-4">
              <CreateOpportunityModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateOpportunity}
              />

              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
              </Button>

              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>CF</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Community Food Bank Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your volunteer opportunities and applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-pink-50 border-pink-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Active Volunteers
                  </p>
                  <p className="text-2xl font-bold text-gray-900">40</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-pink-50 border-pink-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Active Opportunities
                  </p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-pink-50 border-pink-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Pending Applications
                  </p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-pink-50 border-pink-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    This Month's Hours
                  </p>
                  <p className="text-2xl font-bold text-gray-900">320</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-pink-50 grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="border-pink-800">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest updates on your opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">
                          New volunteer application
                        </p>
                        <p className="text-xs text-gray-500">
                          PHEANU applied for Food Bank Volunteer
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">
                          Opportunity filled
                        </p>
                        <p className="text-xs text-gray-500">
                          Holiday Gift Wrapping reached maximum capacity
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">
                          Volunteer confirmed
                        </p>
                        <p className="text-xs text-gray-500">
                          Nu confirmed for Community Garden Helper
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card className="border-pink-800">
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>
                    Your scheduled volunteer opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockOpportunities.slice(0, 3).map((opportunity) => (
                      <div
                        key={opportunity.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">{opportunity.title}</h4>
                          <p className="text-sm text-gray-600">
                            {opportunity.date} • {opportunity.time}
                          </p>
                          <p className="text-xs text-gray-500">
                            {opportunity.volunteers}/{opportunity.maxVolunteers}{" "}
                            volunteers
                          </p>
                        </div>
                        <Badge
                          variant={
                            opportunity.status === "full"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {opportunity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Opportunities</h2>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-pink-800 hover:bg-pink-"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Opportunity
              </Button>
            </div>

            <div className="grid gap-6">
              {mockOpportunities.slice(0, 1).map((opportunity) => (
                <Card key={opportunity.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {opportunity.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{opportunity.date}</span>
                          <span>{opportunity.time}</span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          opportunity.status === "full"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {opportunity.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-indigo-600">
                          {opportunity.volunteers}
                        </p>
                        <p className="text-sm text-gray-600">
                          Confirmed Volunteers
                        </p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {opportunity.maxVolunteers}
                        </p>
                        <p className="text-sm text-gray-600">Max Volunteers</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">
                          {opportunity.applications}
                        </p>
                        <p className="text-sm text-gray-600">Applications</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Volunteer Applications</h2>
              <div className="flex space-x-2"></div>
            </div>

            <div className=" grid gap-6">
              {mockApplications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage
                            src={`/placeholder.svg?height=40&width=40&query=${application.volunteerName}`}
                          />
                          <AvatarFallback>
                            {application.volunteerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">
                            {application.volunteerName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {application.opportunity}
                          </p>
                          <p className="text-xs text-gray-500">
                            Applied on {application.appliedDate}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          application.status === "approved"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {application.status}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {application.skills.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Experience</h4>
                      <p className="text-sm text-gray-700">
                        {application.experience}
                      </p>
                    </div>

                    {application.status === "pending" && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleApplicationAction(application.id, "approve")
                          }
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleApplicationAction(application.id, "reject")
                          }
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
