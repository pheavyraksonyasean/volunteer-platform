import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  Eye,
  Building,
  Upload,
  X,
  Image as ImageIcon,
  FileText,
  Camera,
  Settings,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
} from "lucide-react";
import { format } from "date-fns";

interface CreateOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (opportunityData: any) => void;
  editingOpportunity?: any;
}

export default function CreateOpportunityModal({
  isOpen,
  onClose,
  onSubmit,
  editingOpportunity,
}: CreateOpportunityModalProps) {
  const [step, setStep] = useState(1);
  const [opportunityData, setOpportunityData] = useState({
    // Basic Information
    title: "",
    organizationName: "",
    isVerifiedOrg: false,
    category: "",
    description: "",

    // Event Details
    date: undefined as Date | undefined,
    startTime: "",
    endTime: "",
    location: "",
    maxVolunteers: 50,

    // Requirements
    skillsNeeded: [] as string[],

    // What to Expect
    whatToExpected: [] as string[],

    // Contact & Media
    contactEmail: "",
    images: [] as string[], // Store image URLs/base64
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const categories = [
    "Environmental Conservation",
    "Cultural Heritage",
    "Community Development",
    "Education",
    "Healthcare",
    "Youth Development",
    "Arts & Culture",
  ];

  const skillOptions = [
    "Environmental",
    "Teamwork",
    "Communication",
    "Leadership",
    "Physical Work",
    "Customer Service",
    "Teaching",
    "Technology",
    "Photography",
  ];

  const expectationOptions = [
    "Orientation and training provided",
    "Community service hours certificate available",
    "Refreshments and meals included",
    "Transportation assistance if needed",
    "Professional networking opportunities",
  ];

  const stepConfig = [
    {
      number: 1,
      title: "Basic Info",
      description: "Tell us about your opportunity",
      icon: FileText,
      color: "from-blue-500 to-blue-600",
    },
    {
      number: 2,
      title: "Event Details",
      description: "When and where will it happen",
      icon: CalendarIcon,
      color: "from-purple-500 to-purple-600",
    },
    {
      number: 3,
      title: "Media & Skills",
      description: "Add photos and requirements",
      icon: Camera,
      color: "from-pink-500 to-pink-600",
    },
  ];

  const handleSkillToggle = (skill: string) => {
    setOpportunityData((prev) => ({
      ...prev,
      skillsNeeded: prev.skillsNeeded.includes(skill)
        ? prev.skillsNeeded.filter((s) => s !== skill)
        : [...prev.skillsNeeded, skill],
    }));
  };

  const handleExpectationToggle = (expectation: string) => {
    setOpportunityData((prev) => ({
      ...prev,
      whatToExpected: prev.whatToExpected.includes(expectation)
        ? prev.whatToExpected.filter((e) => e !== expectation)
        : [...prev.whatToExpected, expectation],
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.size > 5 * 1024 * 1024) {
          // 5MB limit
          alert("Image size should be less than 5MB");
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setOpportunityData((prev) => ({
            ...prev,
            images: [...prev.images, imageUrl],
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setOpportunityData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    if (editingOpportunity) {
      const [startTime, endTime] = editingOpportunity.time
        ? editingOpportunity.time.split(" - ")
        : ["", ""];

      setOpportunityData({
        title: editingOpportunity.title || "",
        organizationName: editingOpportunity.organizationName || "",
        isVerifiedOrg: editingOpportunity.isVerifiedOrg || false,
        category: editingOpportunity.category || "",
        description: editingOpportunity.description || "",
        date: editingOpportunity.date
          ? new Date(editingOpportunity.date)
          : undefined,
        startTime: startTime || "",
        endTime: endTime || "",
        location: editingOpportunity.location || "",
        maxVolunteers: editingOpportunity.maxVolunteers || 50,
        skillsNeeded: editingOpportunity.skillsNeeded || [],
        whatToExpected: editingOpportunity.whatToExpected || [],
        contactEmail: editingOpportunity.contactEmail || "",
        images: editingOpportunity.images || [],
      });
    }
    setStep(1);
  }, [editingOpportunity]);

  const handleSubmit = async () => {
    if (!isStepValid()) return;

    setIsSubmitting(true);
    try {
      const finalData = {
        ...opportunityData,
        date: opportunityData.date
          ? opportunityData.date.toISOString().split("T")[0]
          : undefined,
        postedDate: new Date(),
        views: 0,
        applications: 0,
        currentRegistered: 0,
      };

      // Call your API route
      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (!res.ok) throw new Error("Failed to create opportunity");

      await onSubmit(finalData); // Optionally update local state/UI
      onClose();
    } catch (error) {
      console.error("Error creating opportunity:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const isStepValid = () => {
    switch (step) {
      case 1:
        return (
          opportunityData.title &&
          opportunityData.organizationName &&
          opportunityData.category &&
          opportunityData.description.length > 20
        );
      case 2:
        return (
          opportunityData.location &&
          opportunityData.date &&
          opportunityData.startTime &&
          opportunityData.endTime &&
          opportunityData.contactEmail
        );
      default:
        return true;
    }
  };

  if (previewMode) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-0">
          <div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Preview Opportunity</h2>
                <p className="text-sm text-gray-600">How your opportunity will appear to volunteers</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPreviewMode(false)} size="sm">
                  Edit
                </Button>
                <Button onClick={handleSubmit} size="sm" className="bg-pink-600 hover:bg-pink-700">
                  {editingOpportunity ? "Update" : "Publish"}
                </Button>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 space-y-6">
            {/* Hero Image */}
            {opportunityData.images.length > 0 && (
              <div className="relative">
                <img
                  src={opportunityData.images[0]}
                  alt="Opportunity banner"
                  className="w-full h-48 sm:h-64 object-cover rounded-lg"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gray-800 text-white px-3 py-1">
                    {opportunityData.category}
                  </Badge>
                </div>
              </div>
            )}

            {/* Organization Header */}
            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-pink-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {opportunityData.organizationName}
                </h2>
                {opportunityData.isVerifiedOrg && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Verified Organization</span>
                  </div>
                )}
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                {/* Event Details */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Event Details
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <CalendarIcon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Date</p>
                        <p className="text-gray-600">
                          {opportunityData.date
                            ? format(opportunityData.date, "MMM dd, yyyy") // <-- Shows month, day, and year
                            : "Select date"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Time</p>
                        <p className="text-gray-600">
                          {opportunityData.startTime} -{" "}
                          {opportunityData.endTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Location</p>
                        <p className="text-gray-600">
                          {opportunityData.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Volunteers</p>
                        <p className="text-gray-600 mb-2">
                          0 of {opportunityData.maxVolunteers} registered
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-pink-600 h-2 rounded-full"
                            style={{ width: "0%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About This Opportunity */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    About This Opportunity
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {opportunityData.description}
                  </p>
                </div>

                {/* What to Expect */}
                {opportunityData.whatToExpected.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-blue-900 mb-4">
                      What to Expect
                    </h3>
                    <ul className="space-y-3">
                      {opportunityData.whatToExpected.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-blue-800"
                        >
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Column - Requirements & Stats */}
              <div className="space-y-6">
                {/* Requirements */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Requirements
                  </h3>

                  {opportunityData.skillsNeeded.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Skills Needed
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {opportunityData.skillsNeeded.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="text-sm"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Posted:</span>
                      <span className="font-medium">Now</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Views:</span>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">0</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Applications:</span>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-0">
        <div className="sticky top-0 z-10 bg-white border-b px-4 sm:px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold bg-pink-800 bg-clip-text text-transparent">
              {editingOpportunity ? "Edit Opportunity" : "Create New Opportunity"}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Share your volunteer opportunity with the community in 3 easy steps
            </DialogDescription>
          </DialogHeader>

          {/* Enhanced Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              {stepConfig.map((stepInfo, index) => {
                const StepIcon = stepInfo.icon;
                const isActive = step >= stepInfo.number;
                const isCurrent = step === stepInfo.number;
                
                return (
                  <div key={stepInfo.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? `bg-pink-800 text-white shadow-lg`
                            : "bg-gray-200 text-gray-400"
                        } ${isCurrent ? "scale-110 ring-4 ring-white shadow-xl" : ""}`}
                      >
                        <StepIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                        {isCurrent && (
                          <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-30 animate-pulse"></div>
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <p className={`text-xs sm:text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                          {stepInfo.title}
                        </p>
                        <p className="text-xs text-gray-500 hidden sm:block">
                          {stepInfo.description}
                        </p>
                      </div>
                    </div>
                    {index < stepConfig.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 sm:mx-4 rounded-full transition-all duration-300 ${
                          step > stepInfo.number
                            ? `bg-gradient-to-r ${stepInfo.color}`
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-6">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="text-center mb-6">

                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Tell us about your opportunity</h3>
                <p className="text-gray-600">Help volunteers understand what makes your opportunity special</p>
              </div>

              <Card className="shadow-sm border-pink-200">
                <CardHeader className="bg-white">
                  <CardTitle className="flex items-center gap-2 text-pink-800">
                    <Building className="h-5 w-5" />
                    Organization Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="organizationName" className="text-sm font-medium text-gray-700">
                        Organization Name *
                      </Label>
                      <Input
                        id="organizationName"
                        placeholder="e.g., APSARA Authority"
                        value={opportunityData.organizationName}
                        onChange={(e) =>
                          setOpportunityData((prev) => ({
                            ...prev,
                            organizationName: e.target.value,
                          }))
                        }
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6 sm:pt-8">
                      <Checkbox
                        id="verifiedOrg"
                        checked={opportunityData.isVerifiedOrg}
                        onCheckedChange={(checked) =>
                          setOpportunityData((prev) => ({
                            ...prev,
                            isVerifiedOrg: checked as boolean,
                          }))
                        }
                      />
                      <Label
                        htmlFor="verifiedOrg"
                        className="flex items-center text-sm font-medium text-gray-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        Verified Organization
                      </Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                      Opportunity Title *
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g., Temple Conservation Volunteer"
                      value={opportunityData.title}
                      onChange={(e) =>
                        setOpportunityData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                      Category *
                    </Label>
                    <Select
                      value={opportunityData.category}
                      onValueChange={(value) =>
                        setOpportunityData((prev) => ({
                          ...prev,
                          category: value,
                        }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what volunteers will do, the impact they'll make, and why this opportunity matters..."
                      value={opportunityData.description}
                      onChange={(e) =>
                        setOpportunityData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={4}
                      className="mt-1"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className={`text-xs ${
                        opportunityData.description.length < 20 ? 'text-red-500' : 'text-green-600'
                      }`}>
                        {opportunityData.description.length}/20 characters minimum
                      </p>
                      {opportunityData.description.length >= 20 && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          <span className="text-xs">Good!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Event Details */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="text-center mb-6">

                <h3 className="text-lg sm:text-xl font-bold text-gray-900">When and where will it happen?</h3>
                <p className="text-gray-600">Set the time, date, and location for your volunteer event</p>
              </div>

              <Card className="shadow-sm border-pink-200">
                <CardHeader className="bg-ehite0">
                  <CardTitle className="flex items-center gap-2 text-pink-800">
                    <MapPin className="h-5 w-5" />
                    Event Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                      Location *
                    </Label>
                    <Input
                      id="location"
                      placeholder="e.g., Angkor Archaeological Park, Siem Reap"
                      value={opportunityData.location}
                      onChange={(e) =>
                        setOpportunityData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal mt-1"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {opportunityData.date
                              ? format(opportunityData.date, "MMM dd, yyyy")
                              : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={opportunityData.date}
                            onSelect={(date) =>
                              setOpportunityData((prev) => ({ ...prev, date }))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="startTime" className="text-sm font-medium text-gray-700">Start Time *</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={opportunityData.startTime}
                        onChange={(e) =>
                          setOpportunityData((prev) => ({
                            ...prev,
                            startTime: e.target.value,
                          }))
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime" className="text-sm font-medium text-gray-700">End Time *</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={opportunityData.endTime}
                        onChange={(e) =>
                          setOpportunityData((prev) => ({
                            ...prev,
                            endTime: e.target.value,
                          }))
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxVolunteers" className="text-sm font-medium text-gray-700">Maximum Volunteers</Label>
                      <Input
                        id="maxVolunteers"
                        type="number"
                        min="1"
                        value={opportunityData.maxVolunteers}
                        onChange={(e) =>
                          setOpportunityData((prev) => ({
                            ...prev,
                            maxVolunteers: parseInt(e.target.value) || 50,
                          }))
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">Contact Email *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="volunteer@organization.org"
                        value={opportunityData.contactEmail}
                        onChange={(e) =>
                          setOpportunityData((prev) => ({
                            ...prev,
                            contactEmail: e.target.value,
                          }))
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Media & Skills */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="text-center mb-6">

                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Add photos and requirements</h3>
                <p className="text-gray-600">Make your opportunity stand out with great photos and clear expectations</p>
              </div>

              <Card className="shadow-sm border-pink-200">
                <CardHeader className="bg-white">
                  <CardTitle className="flex items-center gap-2 text-pink-800">
                    <ImageIcon className="h-5 w-5" />
                    Photos & Media
                  </CardTitle>
                  <CardDescription>
                    Add compelling photos to attract more volunteers (optional but recommended)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <Label htmlFor="imageUpload" className="cursor-pointer">
                      <div className="border-2 border-dashed border-pink-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors bg-white">
                        <Upload className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                        <p className="text-gray-600 mb-1 font-medium">
                          Click to upload photos
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG up to 5MB each. First image will be the main banner.
                        </p>
                      </div>
                    </Label>
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Display uploaded images */}
                  {opportunityData.images.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700">
                          Uploaded Photos ({opportunityData.images.length})
                        </Label>
                        {opportunityData.images.length > 0 && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">Looking good!</span>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {opportunityData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border shadow-sm"
                            />
                            {index === 0 && (
                              <div className="absolute bottom-1 left-1">
                                <Badge className="text-xs bg-pink-600 text-white">
                                  Main
                                </Badge>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-sm border-pink-200">
                <CardHeader className="bg-white">
                  <CardTitle className="flex items-center gap-2 text-pink-800">
                    <Settings className="h-5 w-5" />
                    Skills & Expectations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div>
                    <Label className="text-sm font-medium mb-3 block text-gray-700">
                      Skills Needed (optional)
                    </Label>
                    <p className="text-xs text-gray-500 mb-3">
                      Select skills that would be helpful for volunteers to have
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {skillOptions.map((skill) => (
                        <div
                          key={skill}
                          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Checkbox
                            id={skill}
                            checked={opportunityData.skillsNeeded.includes(
                              skill
                            )}
                            onCheckedChange={() => handleSkillToggle(skill)}
                          />
                          <Label htmlFor={skill} className="text-sm cursor-pointer">
                            {skill}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {opportunityData.skillsNeeded.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 mb-2">Selected skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {opportunityData.skillsNeeded.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block text-gray-700">
                      What to Expect (optional)
                    </Label>
                    <p className="text-xs text-gray-500 mb-3">
                      Let volunteers know what they can expect from this opportunity
                    </p>
                    <div className="space-y-2">
                      {expectationOptions.map((expectation) => (
                        <div
                          key={expectation}
                          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Checkbox
                            id={expectation}
                            checked={opportunityData.whatToExpected.includes(
                              expectation
                            )}
                            onCheckedChange={() =>
                              handleExpectationToggle(expectation)
                            }
                          />
                          <Label htmlFor={expectation} className="text-sm cursor-pointer flex-1">
                            {expectation}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {opportunityData.whatToExpected.length > 0 && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-800 mb-2">What volunteers can expect:</p>
                        <ul className="space-y-1">
                          {opportunityData.whatToExpected.map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-green-700">
                              <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Enhanced Navigation */}
        <div className="sticky bottom-0 bg-white border-t px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              {step > 1 && (
                <Button variant="outline" onClick={prevStep} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {/* Step indicator for mobile */}
              <div className="flex sm:hidden items-center gap-1">
                {[1, 2, 3].map((stepNum) => (
                  <div
                    key={stepNum}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      step >= stepNum ? 'bg-pink-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {step < 3 ? (
                <Button 
                  onClick={nextStep} 
                  disabled={!isStepValid()}
                  className="flex items-center gap-2 bg-pink-800 hover:from-pink-700 hover:to-purple-700"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setPreviewMode(true)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">Preview</span>
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!isStepValid() || isSubmitting}
                    className="flex items-center gap-2 bg-pink-800 hover:from-pink-700 hover:to-purple-700 min-w-[100px]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="hidden sm:inline">Publishing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        {editingOpportunity ? "Update" : "Publish"}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}