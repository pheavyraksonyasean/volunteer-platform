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
        postedDate: new Date(),
        views: 0,
        applications: 0,
        currentRegistered: 0,
      };

      await onSubmit(finalData);
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Preview Opportunity
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPreviewMode(false)}>
                  Edit
                </Button>
                <Button onClick={handleSubmit}>
                  {editingOpportunity ? "Update" : "Publish"}
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Hero Image */}
            {opportunityData.images.length > 0 && (
              <div className="relative">
                <img
                  src={opportunityData.images[0]}
                  alt="Opportunity banner"
                  className="w-full h-48 object-cover rounded-lg"
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-8">
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
                            ? format(opportunityData.date, "MMM dd, yyyy")
                            : "Date TBD"}
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
                          30 of {opportunityData.maxVolunteers} registered
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-pink-600 h-2 rounded-full"
                            style={{
                              width: `${
                                (30 / opportunityData.maxVolunteers) * 100
                              }%`,
                            }}
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
                      <span className="font-medium">2 days ago</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Views:</span>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">142</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Applications:</span>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">8</span>
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingOpportunity ? "Edit Opportunity" : "Create Opportunity"}
          </DialogTitle>
          <DialogDescription>
            Create a volunteer opportunity for your organization
          </DialogDescription>
        </DialogHeader>

        {/* Simple 2-step progress */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            {[1, 2].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber
                      ? "bg-pink-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 2 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      step > stepNumber ? "bg-pink-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-center text-sm">
          <div
            className={
              step >= 1 ? "text-pink-600 font-medium" : "text-gray-500"
            }
          >
            Basic Information
          </div>
          <div
            className={
              step >= 2 ? "text-pink-600 font-medium" : "text-gray-500"
            }
          >
            Event Details & Requirements
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="organizationName">
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
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
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
                      className="flex items-center text-sm"
                    >
                      <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                      Verified Organization
                    </Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Opportunity Title *</Label>
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
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={opportunityData.category}
                    onValueChange={(value) =>
                      setOpportunityData((prev) => ({
                        ...prev,
                        category: value,
                      }))
                    }
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what volunteers will do and the impact they'll make..."
                    value={opportunityData.description}
                    onChange={(e) =>
                      setOpportunityData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {opportunityData.description.length}/20 characters minimum
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Event Details & Requirements */}
          {step === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="location">Location *</Label>
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
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {opportunityData.date
                              ? format(opportunityData.date, "MMM dd")
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
                      <Label htmlFor="startTime">Start Time *</Label>
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
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">End Time *</Label>
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
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="maxVolunteers">Maximum Volunteers</Label>
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
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactEmail">Contact Email *</Label>
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
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Photos</CardTitle>
                  <CardDescription>
                    Add photos to make your opportunity more appealing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="imageUpload" className="cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 mb-1">
                          Click to upload photos
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG up to 5MB each
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
                      <Label className="text-sm font-medium">
                        Uploaded Photos ({opportunityData.images.length})
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {opportunityData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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

              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expectations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Skills Needed (optional)
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {skillOptions.map((skill) => (
                        <div
                          key={skill}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={skill}
                            checked={opportunityData.skillsNeeded.includes(
                              skill
                            )}
                            onCheckedChange={() => handleSkillToggle(skill)}
                          />
                          <Label htmlFor={skill} className="text-sm">
                            {skill}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      What to Expect (optional)
                    </Label>
                    <div className="space-y-2">
                      {expectationOptions.map((expectation) => (
                        <div
                          key={expectation}
                          className="flex items-center space-x-2"
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
                          <Label htmlFor={expectation} className="text-sm">
                            {expectation}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
          </div>
          <div className="flex space-x-2">
            {step < 2 ? (
              <Button onClick={nextStep} disabled={!isStepValid()}>
                Next
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setPreviewMode(true)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                >
                  {isSubmitting
                    ? "Publishing..."
                    : editingOpportunity
                    ? "Update"
                    : "Publish"}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
