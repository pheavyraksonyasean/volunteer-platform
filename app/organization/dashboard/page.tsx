"use client";

import { useState, useEffect } from "react";
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
  volunteerName: string;
  opportunity: string;
  appliedDate: string;
  status: string;
  skills: string[];
  experience: string;
  motivation: string;
  volunteer_id: string;
  opportunity_id: string;
  volunteer_email: string;
  volunteer_phone: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship?: string; // Make this optional
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
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);

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

  // New: fetch applications for the organization's opportunities
  const fetchApplications = async () => {
    try {
      setIsLoadingApplications(true);
      console.log("Fetching applications...");
      const res = await fetch("/api/organization/applications", {
        method: "GET",
        credentials: "same-origin",
      });
      
      console.log("Applications response status:", res.status);
      
      if (!res.ok) {
        console.error("Failed to fetch applications for organization", res.status);
        const errorText = await res.text();
        console.error("Error details:", errorText);
        return;
      }
      
      const data = await res.json();
      console.log("Raw applications data:", data);
      
      // Transform the data to match the Application interface
      const transformedApplications: Application[] = (data || []).map((app: any) => {
        console.log("Transforming application:", app);
        return {
          id: app.id,
          volunteerName: app.volunteer_name || "Unknown Volunteer",
          opportunity: app.opportunity?.opportunity_title || "Unknown Opportunity",
          appliedDate: app.applied_at ? new Date(app.applied_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }) : "Unknown Date",
          status: app.status || "pending",
          skills: app.skills || [],
          experience: app.relevant_experience || "No experience provided",
          motivation: app.motivation || "No motivation provided",
          volunteer_id: app.volunteer_id,
          opportunity_id: app.opportunity_id,
          volunteer_email: app.volunteer_email || "",
          volunteer_phone: app.volunteer_phone || "",
          emergency_contact_name: app.emergency_contact_name || "",
          emergency_contact_phone: app.emergency_contact_phone || "",
          emergency_contact_relationship: app.emergency_contact_relationship || "",
        };
      });
      
      console.log("Transformed applications:", transformedApplications);
      console.log(`✅ Successfully loaded ${transformedApplications.length} applications`);
      setApplications(transformedApplications);
    } catch (err) {
      console.error("❌ Error fetching applications:", err);
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
          // fetch opportunities and applications once profile (and auth cookie) is ready
          await Promise.all([fetchOpportunities(), fetchApplications()]);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, []);

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

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
      await Promise.all([fetchOpportunities(), fetchApplications()]);

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
      // Optimistic update
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, status: action === "approve" ? "approved" : "rejected" }
            : app
        )
      );

      // Send update to backend (you'll need to create this API endpoint)
      const res = await fetch("/api/organization/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          applicationId, 
          status: action === "approve" ? "approved" : "rejected" 
        }),
        credentials: "same-origin",
      });

      if (!res.ok) {
        console.error("Failed to update application status");
        // Revert optimistic update on failure
        await fetchApplications();
      }

      console.log(`${action}d application ${applicationId}`);
    } catch (error) {
      console.error("Error updating application:", error);
      // Revert optimistic update on error
      await fetchApplications();
    }
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
                    {opportunities.reduce((sum, opp) => sum + opp.volunteers, 0)}
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
                    {applications.slice(0, 3).map((app, index) => (
                      <div key={app.id} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          app.status === "pending" ? "bg-yellow-500" :
                          app.status === "approved" ? "bg-green-500" : "bg-red-500"
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium">
                            {app.status === "pending" ? "New volunteer application" :
                             app.status === "approved" ? "Volunteer approved" : "Application reviewed"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {app.volunteerName} applied for {app.opportunity}
                          </p>
                        </div>
                      </div>
                    ))}
                    {applications.length === 0 && (
                      <p className="text-sm text-gray-500">No recent activity</p>
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
                      <div
                        key={opportunity.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm md:text-base">
                            {opportunity.title}
                          </h4>
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
                          className="text-xs"
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
            <div className="flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold">
                Volunteer Applications
              </h2>
            </div>

            {isLoadingApplications ? (
              <div className="flex justify-center items-center p-8">
                <p className="text-gray-500">Loading applications...</p>
              </div>
            ) : (
              <div className="grid gap-4 md:gap-6">
                {applications.map((application) => (
                  <Card key={application.id}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                        <div className="flex items-center space-x-3 md:space-x-4 flex-1">
                          <Avatar className="h-8 w-8 md:h-10 md:w-10">
                            <AvatarImage
                              src={`/abstract-geometric-shapes.png?height=40&width=40&query=${application.volunteerName}`}
                            />
                            <AvatarFallback className="text-xs md:text-sm">
                              {application.volunteerName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm md:text-base">
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
                              : application.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {application.status}
                        </Badge>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2 text-sm md:text-base">
                          Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {application.skills.length > 0 ? (
                            application.skills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="outline"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">No skills listed</p>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2 text-sm md:text-base">
                          Contact Information
                        </h4>
                        <div className="text-sm text-gray-700 space-y-1">
                          {application.volunteer_email && (
                            <p>Email: {application.volunteer_email}</p>
                          )}
                          {application.volunteer_phone && (
                            <p>Phone: {application.volunteer_phone}</p>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2 text-sm md:text-base">
                          Motivation
                        </h4>
                        <p className="text-sm text-gray-700">
                          {application.motivation}
                        </p>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2 text-sm md:text-base">
                          Experience
                        </h4>
                        <p className="text-sm text-gray-700">
                          {application.experience}
                        </p>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2 text-sm md:text-base">
                          Emergency Contact
                        </h4>
                        <div className="text-sm text-gray-700 space-y-1">
                          {application.emergency_contact_name && (
                            <p>Name: {application.emergency_contact_name}</p>
                          )}
                          {application.emergency_contact_phone && (
                            <p>Phone: {application.emergency_contact_phone}</p>
                          )}
                          {application.emergency_contact_relationship && (
                            <p>Relationship: {application.emergency_contact_relationship}</p>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2 text-sm md:text-base">
                          Address
                        </h4>
                        <p className="text-sm text-gray-700">
                          {application.address}
                        </p>
                      </div>

                      {application.status === "pending" && (
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleApplicationAction(application.id, "approve")
                            }
                            className="text-xs md:text-sm"
                          >
                            <CheckCircle className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleApplicationAction(application.id, "reject")
                            }
                            className="text-xs md:text-sm"
                          >
                            <XCircle className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {application.status === "approved" && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />
                          <span className="text-xs md:text-sm font-medium">
                            Approved
                          </span>
                        </div>
                      )}

                      {application.status === "rejected" && (
                        <div className="flex items-center space-x-2 text-red-600">
                          <XCircle className="h-3 w-3 md:h-4 md:w-4" />
                          <span className="text-xs md:text-sm font-medium">
                            Rejected
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {applications.length === 0 && !isLoadingApplications && (
                  <Card>
                    <CardContent className="p-6 md:p-8 text-center">
                      <p className="text-gray-500 text-sm md:text-base">
                        No applications received yet.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}