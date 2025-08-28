"use client";
import React, { useEffect, useState } from "react";
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
  Plus,
  Users,
  Calendar,
  TrendingUp,
  Bell,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  FileText,
  User,
  MessageSquare,
  Award,
  CalendarDays,
} from "lucide-react";

import CreateOpportunityModal from "@/components/opportunity/create-opportunity-modal";
import ProfileMenu from "@/components/profile-menu/ProfileMenu";

interface Opportunity {
  id: string;
  title: string;
  date: string;
  time: string;
  volunteers: number;
  maxVolunteers: number;
  applications: number;
  status: string;
  category?: string;
  description?: string;
  location?: string;
  isPublic?: boolean;
}

interface Application {
  id: string;
  volunteer_id: string;
  opportunity_id: string;
  motivation: string;
  relevant_experience: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  resume_file_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
  volunteer?: {
    first_name: string;
    last_name: string;
    email: string;
    profile_image_url?: string;
  };
  opportunity?: {
    id: string;
    opportunity_title: string;
    organization_name: string;
    date: string;
    start_time: string;
    end_time: string;
    location: string;
  };
  skills?: string[];
}

export default function OrganizationDashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [profileImage, setProfileImage] = useState(
    "/placeholder.svg?height=32&width=32"
  );
  const [editingOpportunity, setEditingOpportunity] =
    useState<Opportunity | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const [expandedApplications, setExpandedApplications] = useState<Set<string>>(new Set());

  // New: fetch organizer's opportunities from backend
  const fetchOpportunities = async () => {
    try {
      const res = await fetch("/api/opportunities?mine=true", {
        method: "GET",
        credentials: "same-origin",
      });
      if (!res.ok) {
        console.warn("Failed to fetch opportunities for dashboard");
        return;
      }
      const data = await res.json();
      // transform server opportunity rows -> local Opportunity shape
      const transformed: Opportunity[] = (data || []).map((r: any) => {
        const dateStr = r.date ? new Date(r.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }) : "TBD";
        const timeStr =
          r.start_time && r.end_time ? `${r.start_time} - ${r.end_time}` : "TBD";
        return {
          id: r.id,
          title: r.opportunity_title || "Untitled",
          date: dateStr,
          time: timeStr,
          volunteers: r.confirmed_volunteers ?? 0, // if not present, default 0
          maxVolunteers: r.maximum_volunteer ?? 1,
          applications: r.applications_count ?? 0,
          status: r.status ?? "active",
          category: r.category_name,
          description: r.description,
          location: r.location,
          isPublic: true,
        };
      });
      setOpportunities(transformed);
    } catch (err) {
      console.error("Error fetching opportunities:", err);
    }
  };

  // New: fetch applications for organizer's opportunities
  const fetchApplications = async () => {
    console.debug("[DEBUG] fetchApplications called");
    setIsLoadingApplications(true);
    try {
      const res = await fetch("/api/applications/organization", {
        method: "GET",
        credentials: "same-origin",
      });
      console.debug("[DEBUG] /api/applications/organization status:", res.status);
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.warn("Failed to fetch applications for organization", res.status, text);
        return;
      }
      const data = await res.json();
      console.debug("[DEBUG] applications payload:", data);
      setApplications(data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setIsLoadingApplications(false);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const data = await response.json();
        if (data.user) {
          const userData = data.user;
          const transformedUser = {
            ...userData,
            name: `${userData.first_name || ""} ${
              userData.last_name || ""
            }`.trim(),
            phone: userData.phone_number,
          };
          setUser(transformedUser);
          if (userData.profile_image_url) {
            setProfileImage(userData.profile_image_url);
          }
          // fetch opportunities once profile (and auth cookie) is ready
          fetchOpportunities();
          // fetch applications for this organization
          fetchApplications();
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, []);

  // When user is available, load organizer data
  useEffect(() => {
    if (!user) return;
    (async () => {
      console.debug("[DEBUG] user available, loading organizer data");
      await fetchOpportunities();
      // explicitly await so opportunities finish before applications
      await fetchApplications();
    })();
  }, [user]);

  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: "1",
      title: "Food Bank Volunteer",
      date: "Dec 15, 2024",
      time: "9:00 AM - 1:00 PM",
      volunteers: 12,
      maxVolunteers: 20,
      applications: 25,
      status: "active",
      isPublic: true,
    },
  ]);

  const handleCreateOpportunity = async (opportunityData: any) => {
    console.log("New opportunity created:", opportunityData);

    // If editing existing opportunity => call PUT, else POST
    try {
      if (editingOpportunity) {
        // optimistic local update (keeps UI snappy)
        const updatedOpportunity: Opportunity = {
          ...editingOpportunity,
          title: opportunityData.title,
          date: opportunityData.date
            ? new Date(opportunityData.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "TBD",
          time:
            opportunityData.startTime && opportunityData.endTime
              ? `${opportunityData.startTime} - ${opportunityData.endTime}`
              : "TBD",
          maxVolunteers: opportunityData.maxVolunteers || 10,
          category: opportunityData.category,
          description: opportunityData.description,
          location: opportunityData.location,
          isPublic: !opportunityData.isDraft,
          volunteers: editingOpportunity.volunteers ?? 0,
          applications: editingOpportunity.applications ?? 0,
          status: editingOpportunity.status ?? "active",
        };

        setOpportunities((prev) =>
          prev.map((opp) =>
            opp.id === editingOpportunity.id ? updatedOpportunity : opp
          )
        );

        // send update to API
        await fetch("/api/opportunities", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingOpportunity.id, ...opportunityData }),
          credentials: "same-origin",
        });

        setEditingOpportunity(null);
      } else {
        // create new opportunity via API
        const payload = { ...opportunityData };
        const res = await fetch("/api/opportunities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "same-origin",
        });
        if (!res.ok) {
          console.error("Failed to create opportunity:", await res.text());
        }
      }

      // refresh list from server to ensure authoritative data
      await fetchOpportunities();
      // refresh applications as well
      await fetchApplications();

      // switch to opportunities tab if creating a live one
      if (!opportunityData.isDraft) setActiveTab("opportunities");
    } catch (err) {
      console.error("Error creating/updating opportunity:", err);
    } finally {
      setShowCreateModal(false);
    }
  };

  const handleDeleteOpportunity = (opportunityId: string | number) => {
    if (confirm("Are you sure you want to delete this opportunity?")) {
      // optimistic local remove
      setOpportunities((prev) => prev.filter((opp) => opp.id !== opportunityId));
      // request delete on backend (assuming route supports DELETE by id)
      fetch(`/api/opportunities?id=${opportunityId}`, {
        method: "DELETE",
        credentials: "same-origin",
      }).then((res) => {
        if (!res.ok) {
          console.warn("Failed to delete opportunity on server");
          // optionally re-fetch authoritative list
          fetchOpportunities();
        }
      });
    }
  };

  const handleEditOpportunity = (opportunity: Opportunity) => {
    setEditingOpportunity(opportunity);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingOpportunity(null);
  };

  const handleApplicationAction = async (
    applicationId: string,
    action: "approve" | "reject"
  ) => {
    try {
      const response = await fetch(`/api/applications/organization`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId,
          status: action === "approve" ? "approved" : "rejected",
        }),
        credentials: "same-origin",
      });

      if (!response.ok) {
        throw new Error("Failed to update application status");
      }

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, status: action === "approve" ? "approved" : "rejected" }
            : app
        )
      );

      console.log(`${action}d application ${applicationId}`);
    } catch (error) {
      console.error("Error updating application:", error);
      alert("Failed to update application status. Please try again.");
    }
  };

  const toggleApplicationExpansion = (applicationId: string) => {
    setExpandedApplications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(applicationId)) {
        newSet.delete(applicationId);
      } else {
        newSet.add(applicationId);
      }
      return newSet;
    });
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper function to get volunteer's full name
  const getVolunteerName = (application: Application) => {
    if (application.volunteer) {
      return `${application.volunteer.first_name || ""} ${application.volunteer.last_name || ""}`.trim();
    }
    return "Unknown Volunteer";
  };

  if (isLoadingProfile) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <p>Could not load user profile.</p>
        <Link href="/login">
          <Button>Go to Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-pink-800 shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-4">
            <div className="flex items-center min-w-0 flex-1">
              <img
                src="/logo.png"
                alt="sabay volunteer"
                className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 flex-shrink-0"
              />
              <span className="text-sm sm:text-lg md:text-2xl font-bold text-white font-serif ml-1 sm:ml-2 truncate">
                Sabay Volunteer
              </span>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 flex-shrink-0">
              <CreateOpportunityModal
                isOpen={showCreateModal}
                onClose={handleCloseModal}
                onSubmit={handleCreateOpportunity}
                editingOpportunity={editingOpportunity}
              />
              <Button variant="ghost" size="sm" className="relative p-1 sm:p-2">
                <Bell className="text-white h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-2 w-2 md:h-3 md:w-3 bg-red-500 rounded-full"></span>
              </Button>
              <ProfileMenu
                profileImage={profileImage}
                setProfileImage={setProfileImage}
                mockUser={user}
                setMockUser={setUser}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user.name}!
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Manage your volunteer opportunities and applications
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card className="bg-pink-50 border-pink-800">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center">
                <div className="p-1 md:p-2 bg-indigo-100 rounded-lg">
                  <Users className="h-4 w-4 md:h-6 md:w-6 text-indigo-600" />
                </div>
                <div className="ml-2 md:ml-4">
                  <p className="text-xs md:text-sm font-medium text-gray-600">
                    Active Volunteers
                  </p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">
                    {opportunities.reduce((total, opp) => total + opp.volunteers, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-pink-50 border-pink-800">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center">
                <div className="p-1 md:p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
                </div>
                <div className="ml-2 md:ml-4">
                  <p className="text-xs md:text-sm font-medium text-gray-600">
                    Active Opportunities
                  </p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">
                    {opportunities.filter(opp => opp.status === "active").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-pink-50 border-pink-800">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center">
                <div className="p-1 md:p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-4 w-4 md:h-6 md:w-6 text-yellow-600" />
                </div>
                <div className="ml-2 md:ml-4">
                  <p className="text-xs md:text-sm font-medium text-gray-600">
                    Pending Applications
                  </p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.status === "pending").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-pink-50 border-pink-800">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center">
                <div className="p-1 md:p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
                </div>
                <div className="ml-2 md:ml-4">
                  <p className="text-xs md:text-sm font-medium text-gray-600">
                    Total Applications
                  </p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">
                    {applications.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4 md:space-y-6"
        >
          <div className="overflow-x-auto">
            <TabsList className="bg-pink-50 grid w-full grid-cols-3 min-w-max md:min-w-0">
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
                Opportunities
              </TabsTrigger>
              <TabsTrigger
                value="applications"
                className="text-xs md:text-sm px-2 md:px-4"
              >
                Applications
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card>
                <CardHeader className="pb-3 md:pb-6">
                  <CardTitle className="text-lg md:text-xl">
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Latest updates on your opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 md:space-y-4">
                    {applications.slice(0, 3).map((application) => (
                      <div key={application.id} className="p-3 bg-white rounded-md shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{getVolunteerName(application)}</p>
                            <p className="text-xs text-gray-500">{application.volunteer?.email}</p>
                          </div>
                          <p className="text-xs px-2 py-1 rounded-md bg-gray-100">{application.status}</p>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">{application.motivation || ""}</div>
                      </div>
                    ))}
                    {applications.length === 0 && (
                      <p className="text-sm text-gray-500">No recent applications</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 md:pb-6">
                  <CardTitle className="text-lg md:text-xl">
                    Upcoming Events
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Your scheduled volunteer opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 md:space-y-4">
                    {opportunities.slice(0, 3).map((opportunity) => (
                      <div key={opportunity.id} className="p-3 bg-white rounded-md shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold">{opportunity.title}</p>
                            <p className="text-xs text-gray-500">{opportunity.date} · {opportunity.time}</p>
                          </div>
                          <div className="text-sm text-gray-600">{opportunity.volunteers}/{opportunity.maxVolunteers} volunteers</div>
                        </div>
                        {opportunity.location && <div className="mt-2 text-sm text-gray-700">{opportunity.location}</div>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl md:text-2xl font-bold">
                Your Opportunities
              </h2>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-pink-800 hover:bg-pink-700 w-full sm:w-auto text-sm md:text-base"
              >
                <Plus className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                Create Opportunity
              </Button>
            </div>

            <div className="grid gap-4 md:gap-6">
              {opportunities
                .filter((opp) => opp.isPublic)
                .map((opportunity) => (
                  <Card key={opportunity.id}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg md:text-xl font-semibold mb-2">
                            {opportunity.title}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600 gap-1 sm:gap-0">
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
                          className="text-xs"
                        >
                          {opportunity.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4">
                        <div className="text-center p-2 md:p-3 bg-gray-50 rounded-lg">
                          <p className="text-lg md:text-2xl font-bold text-indigo-600">
                            {opportunity.volunteers}
                          </p>
                          <p className="text-xs md:text-sm text-gray-600">
                            Confirmed Volunteers
                          </p>
                        </div>
                        <div className="text-center p-2 md:p-3 bg-gray-50 rounded-lg">
                          <p className="text-lg md:text-2xl font-bold text-green-600">
                            {opportunity.maxVolunteers}
                          </p>
                          <p className="text-xs md:text-sm text-gray-600">
                            Max Volunteers
                          </p>
                        </div>
                        <div className="text-center p-2 md:p-3 bg-gray-50 rounded-lg">
                          <p className="text-lg md:text-2xl font-bold text-yellow-600">
                            {opportunity.applications}
                          </p>
                          <p className="text-xs md:text-sm text-gray-600">
                            Applications
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditOpportunity(opportunity)}
                          className="text-xs md:text-sm"
                        >
                          <Edit className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDeleteOpportunity(opportunity.id)
                          }
                          className="text-xs md:text-sm"
                        >
                          <Trash2 className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {opportunities.filter((opp) => opp.isPublic).length === 0 && (
                <Card>
                  <CardContent className="p-6 md:p-8 text-center">
                    <p className="text-gray-500 mb-4 text-sm md:text-base">
                      No public opportunities yet.
                    </p>
                    <Button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-pink-800 hover:bg-pink-700 text-sm md:text-base"
                    >
                      <Plus className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                      Create Your First Opportunity
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4 md:space-y-6">
            <Card className="border-pink-200 bg-gradient-to-r from-pink-50 to-white">
              <CardHeader className="pb-3 md:pb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Users className="h-6 w-6 text-pink-700" />
                  </div>
                  <div>
                    <CardTitle className="text-lg md:text-xl text-gray-900">
                      Volunteer Applications
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base">
                      Review and manage applications for your opportunities
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingApplications ? (
                  <div className="flex justify-center items-center py-12">Loading applications...</div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-12">No applications yet.</div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div key={application.id} className="p-4 bg-white rounded-md shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{getVolunteerName(application)}</p>
                                <p className="text-xs text-gray-500">{application.volunteer?.email}</p>
                                <p className="text-xs text-gray-500">{application.opportunity?.opportunity_title}</p>
                              </div>
                              <div className="text-sm">
                                <span className={`px-2 py-1 rounded text-xs ${application.status === "pending" ? "bg-yellow-100 text-yellow-800" : application.status === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                  {application.status}
                                </span>
                              </div>
                            </div>
                            {expandedApplications.has(application.id) && (
                              <div className="mt-3 text-sm text-gray-700">
                                <p className="font-semibold">Motivation</p>
                                <p>{application.motivation || "—"}</p>
                                {application.relevant_experience && (
                                  <>
                                    <p className="mt-2 font-semibold">Experience</p>
                                    <p>{application.relevant_experience}</p>
                                  </>
                                )}
                                {application.resume_file_url && (
                                  <p className="mt-2">
                                    <a href={application.resume_file_url} target="_blank" rel="noreferrer" className="text-pink-700 underline">View resume</a>
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={() => toggleApplicationExpansion(application.id)}
                            className="text-sm text-gray-600 hover:text-gray-800"
                          >
                            {expandedApplications.has(application.id) ? "Hide details" : "View details"}
                          </button>
                          {application.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApplicationAction(application.id, "approve")}
                                className="ml-auto bg-green-600 text-white px-3 py-1 rounded text-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleApplicationAction(application.id, "reject")}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
