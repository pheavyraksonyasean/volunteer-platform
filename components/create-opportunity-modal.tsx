"use client";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  CalendarIcon,
  Clock,
  MapPin,
  Users,
  Upload,
  CheckCircle,
  X,
  Plus,
  Minus,
  AlertCircle,
  Eye,
  Save,
} from "lucide-react";
import { format } from "date-fns";
import FileUpload from "./file-upload";

interface CreateOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (opportunityData: any) => void;
}

export default function CreateOpportunityModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateOpportunityModalProps) {
  const [step, setStep] = useState(1);
  const [opportunityData, setOpportunityData] = useState({
    title: "",
    category: "",
    description: "",
    requirements: "",
    location: "",
    address: "",
    isRemote: false,
    date: undefined as Date | undefined,
    startTime: "",
    endTime: "",
    isRecurring: false,
    recurringPattern: "",
    maxVolunteers: 10,
    minAge: 16,
    backgroundCheck: false,
    skills: [] as string[],
    benefits: [] as string[],
    contactEmail: "",
    contactPhone: "",
    applicationDeadline: undefined as Date | undefined,
    isUrgent: false,
    images: [] as File[],
    documents: [] as File[],
    customQuestions: [] as string[],
    autoApprove: false,
    sendReminders: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const categories = [
    "Hunger Relief",
    "Environment",
    "Education",
    "Senior Care",
    "Animal Welfare",
    "Healthcare",
    "Community Development",
    "Arts & Culture",
    "Sports & Recreation",
    "Disaster Relief",
    "Youth Development",
    "Homelessness",
  ];

  const skillOptions = [
    "Communication",
    "Leadership",
    "Teaching",
    "Customer Service",
    "Physical Work",
    "Technology",
    "Event Planning",
    "Fundraising",
    "Social Media",
    "Photography",
    "Writing",
    "Translation",
    "First Aid",
    "Driving",
    "Cooking",
    "Childcare",
    "Elder Care",
    "Animal Care",
  ];

  const benefitOptions = [
    "Community Service Hours",
    "Training Provided",
    "Meals Included",
    "Transportation Provided",
    "Certificate of Completion",
    "Reference Letter",
    "Networking Opportunities",
    "Skill Development",
    "Free T-shirt",
    "Parking Provided",
  ];

  const handleSkillToggle = (skill: string) => {
    setOpportunityData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleBenefitToggle = (benefit: string) => {
    setOpportunityData((prev) => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter((b) => b !== benefit)
        : [...prev.benefits, benefit],
    }));
  };

  const addCustomQuestion = () => {
    setOpportunityData((prev) => ({
      ...prev,
      customQuestions: [...prev.customQuestions, ""],
    }));
  };

  const updateCustomQuestion = (index: number, question: string) => {
    setOpportunityData((prev) => ({
      ...prev,
      customQuestions: prev.customQuestions.map((q, i) =>
        i === index ? question : q
      ),
    }));
  };

  const removeCustomQuestion = (index: number) => {
    setOpportunityData((prev) => ({
      ...prev,
      customQuestions: prev.customQuestions.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (files: File[]) => {
    setOpportunityData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleDocumentUpload = (files: File[]) => {
    setOpportunityData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...files],
    }));
  };

  const handleSubmit = async (isDraft = false) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    onSubmit({
      ...opportunityData,
      status: isDraft ? "draft" : "published",
      createdAt: new Date().toISOString(),
    });

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Close modal after showing success
    setTimeout(() => {
      setIsSubmitted(false);
      setStep(1);
      setPreviewMode(false);
      onClose();
    }, 3000);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const isStepValid = () => {
    switch (step) {
      case 1:
        return (
          opportunityData.title &&
          opportunityData.category &&
          opportunityData.description.length > 50
        );
      case 2:
        return (
          opportunityData.location &&
          opportunityData.date &&
          opportunityData.startTime &&
          opportunityData.endTime
        );
      case 3:
        return (
          opportunityData.maxVolunteers > 0 && opportunityData.contactEmail
        );
      case 4:
        return true;
      default:
        return true;
    }
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Opportunity Created!
            </h3>
            <p className="text-gray-600 mb-4">
              Your volunteer opportunity{" "}
              <strong>{opportunityData.title}</strong> has been successfully
              created.
            </p>
            <p className="text-sm text-gray-500">
              It will be reviewed and published within 24 hours. You'll receive
              an email confirmation shortly.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (previewMode) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Preview Opportunity
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPreviewMode(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button onClick={() => handleSubmit(false)}>Publish</Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Preview Content */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {opportunityData.title}
                      </h2>
                      <Badge className="mt-2">{opportunityData.category}</Badge>
                      {opportunityData.isUrgent && (
                        <Badge className="ml-2 bg-red-500">Urgent</Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {opportunityData.isRemote
                        ? "Remote"
                        : opportunityData.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {opportunityData.date
                        ? format(opportunityData.date, "PPP")
                        : "Date TBD"}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {opportunityData.startTime} - {opportunityData.endTime}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      Up to {opportunityData.maxVolunteers} volunteers
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-gray-700">
                        {opportunityData.description}
                      </p>
                    </div>

                    {opportunityData.requirements && (
                      <div>
                        <h3 className="font-semibold mb-2">Requirements</h3>
                        <p className="text-gray-700">
                          {opportunityData.requirements}
                        </p>
                      </div>
                    )}

                    {opportunityData.skills.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Skills Needed</h3>
                        <div className="flex flex-wrap gap-2">
                          {opportunityData.skills.map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {opportunityData.benefits.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">What You'll Get</h3>
                        <div className="flex flex-wrap gap-2">
                          {opportunityData.benefits.map((benefit) => (
                            <Badge key={benefit} variant="secondary">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Create Volunteer Opportunity
          </DialogTitle>
          <DialogDescription>
            Create a new volunteer opportunity for your organization
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
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
                {stepNumber < 4 && (
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

        {/* Step Labels */}
        <div className="grid grid-cols-4 gap-4 mb-6 text-center text-sm">
          <div
            className={
              step >= 1 ? "text-pink-600 font-medium" : "text-gray-500"
            }
          >
            Basic Info
          </div>
          <div
            className={
              step >= 2 ? "text-indigo-600 font-medium" : "text-gray-500"
            }
          >
            Schedule & Location
          </div>
          <div
            className={
              step >= 3 ? "text-indigo-600 font-medium" : "text-gray-500"
            }
          >
            Requirements
          </div>
          <div
            className={
              step >= 4 ? "text-indigo-600 font-medium" : "text-gray-500"
            }
          >
            Review & Publish
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Tell volunteers about your opportunity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Opportunity Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Food Bank Volunteer, Beach Cleanup Helper"
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
                    placeholder="Describe what volunteers will do, the impact they'll make, and why this opportunity matters..."
                    value={opportunityData.description}
                    onChange={(e) =>
                      setOpportunityData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={6}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {opportunityData.description.length}/50 characters minimum
                  </p>
                </div>

                <div>
                  <Label htmlFor="requirements">
                    Requirements & Expectations
                  </Label>
                  <Textarea
                    id="requirements"
                    placeholder="Any specific requirements, skills needed, or expectations for volunteers..."
                    value={opportunityData.requirements}
                    onChange={(e) =>
                      setOpportunityData((prev) => ({
                        ...prev,
                        requirements: e.target.value,
                      }))
                    }
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="urgent"
                    checked={opportunityData.isUrgent}
                    onCheckedChange={(checked) =>
                      setOpportunityData((prev) => ({
                        ...prev,
                        isUrgent: checked,
                      }))
                    }
                  />
                  <Label htmlFor="urgent" className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                    Mark as urgent (needs volunteers immediately)
                  </Label>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Schedule & Location</CardTitle>
                <CardDescription>
                  When and where will this opportunity take place?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    id="remote"
                    checked={opportunityData.isRemote}
                    onCheckedChange={(checked) =>
                      setOpportunityData((prev) => ({
                        ...prev,
                        isRemote: checked,
                      }))
                    }
                  />
                  <Label htmlFor="remote">
                    This is a remote/virtual opportunity
                  </Label>
                </div>

                {!opportunityData.isRemote && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location/City *</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Downtown, NY"
                        value={opportunityData.location}
                        onChange={(e) =>
                          setOpportunityData((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Full Address</Label>
                      <Input
                        id="address"
                        placeholder="Street address for volunteers"
                        value={opportunityData.address}
                        onChange={(e) =>
                          setOpportunityData((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-transparent"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {opportunityData.date
                            ? format(opportunityData.date, "PPP")
                            : "Pick a date"}
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

                <div className="flex items-center space-x-2">
                  <Switch
                    id="recurring"
                    checked={opportunityData.isRecurring}
                    onCheckedChange={(checked) =>
                      setOpportunityData((prev) => ({
                        ...prev,
                        isRecurring: checked,
                      }))
                    }
                  />
                  <Label htmlFor="recurring">
                    This is a recurring opportunity
                  </Label>
                </div>

                {opportunityData.isRecurring && (
                  <div>
                    <Label htmlFor="recurringPattern">Recurring Pattern</Label>
                    <Select
                      value={opportunityData.recurringPattern}
                      onValueChange={(value) =>
                        setOpportunityData((prev) => ({
                          ...prev,
                          recurringPattern: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="How often does this repeat?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Every 2 weeks</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="custom">Custom schedule</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label>Application Deadline</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-transparent"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {opportunityData.applicationDeadline
                          ? format(opportunityData.applicationDeadline, "PPP")
                          : "No deadline (optional)"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={opportunityData.applicationDeadline}
                        onSelect={(date) =>
                          setOpportunityData((prev) => ({
                            ...prev,
                            applicationDeadline: date,
                          }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Volunteer Requirements</CardTitle>
                  <CardDescription>
                    Set requirements and preferences for volunteers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxVolunteers">
                        Maximum Volunteers *
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setOpportunityData((prev) => ({
                              ...prev,
                              maxVolunteers: Math.max(
                                1,
                                prev.maxVolunteers - 1
                              ),
                            }))
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          id="maxVolunteers"
                          type="number"
                          min="1"
                          value={opportunityData.maxVolunteers}
                          onChange={(e) =>
                            setOpportunityData((prev) => ({
                              ...prev,
                              maxVolunteers:
                                Number.parseInt(e.target.value) || 1,
                            }))
                          }
                          className="text-center"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setOpportunityData((prev) => ({
                              ...prev,
                              maxVolunteers: prev.maxVolunteers + 1,
                            }))
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="minAge">Minimum Age</Label>
                      <Select
                        value={opportunityData.minAge.toString()}
                        onValueChange={(value) =>
                          setOpportunityData((prev) => ({
                            ...prev,
                            minAge: Number.parseInt(value),
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="13">13+</SelectItem>
                          <SelectItem value="16">16+</SelectItem>
                          <SelectItem value="18">18+</SelectItem>
                          <SelectItem value="21">21+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="backgroundCheck"
                      checked={opportunityData.backgroundCheck}
                      onCheckedChange={(checked) =>
                        setOpportunityData((prev) => ({
                          ...prev,
                          backgroundCheck: checked as boolean,
                        }))
                      }
                    />
                    <Label htmlFor="backgroundCheck">
                      Background check required
                    </Label>
                  </div>

                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      Preferred Skills
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                      {skillOptions.map((skill) => (
                        <div
                          key={skill}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={skill}
                            checked={opportunityData.skills.includes(skill)}
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
                    <Label className="text-base font-medium mb-3 block">
                      What Volunteers Get
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {benefitOptions.map((benefit) => (
                        <div
                          key={benefit}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={benefit}
                            checked={opportunityData.benefits.includes(benefit)}
                            onCheckedChange={() => handleBenefitToggle(benefit)}
                          />
                          <Label htmlFor={benefit} className="text-sm">
                            {benefit}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    How volunteers can reach you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div>
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={opportunityData.contactPhone}
                        onChange={(e) =>
                          setOpportunityData((prev) => ({
                            ...prev,
                            contactPhone: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Additional Settings</CardTitle>
                  <CardDescription>
                    Customize your application process
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoApprove">
                        Auto-approve applications
                      </Label>
                      <p className="text-sm text-gray-500">
                        Automatically approve volunteers who meet requirements
                      </p>
                    </div>
                    <Switch
                      id="autoApprove"
                      checked={opportunityData.autoApprove}
                      onCheckedChange={(checked) =>
                        setOpportunityData((prev) => ({
                          ...prev,
                          autoApprove: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sendReminders">Send reminders</Label>
                      <p className="text-sm text-gray-500">
                        Email reminders to confirmed volunteers
                      </p>
                    </div>
                    <Switch
                      id="sendReminders"
                      checked={opportunityData.sendReminders}
                      onCheckedChange={(checked) =>
                        setOpportunityData((prev) => ({
                          ...prev,
                          sendReminders: checked,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      Custom Application Questions
                    </Label>
                    <div className="space-y-2">
                      {opportunityData.customQuestions.map(
                        (question, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <Input
                              placeholder="Enter your question..."
                              value={question}
                              onChange={(e) =>
                                updateCustomQuestion(index, e.target.value)
                              }
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeCustomQuestion(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addCustomQuestion}
                        className="bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Question
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Media & Documents</CardTitle>
                  <CardDescription>
                    Add photos and documents to make your opportunity more
                    appealing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      Photos
                    </Label>
                    <FileUpload
                      onFileUpload={handleImageUpload}
                      acceptedTypes={[".jpg", ".jpeg", ".png", ".webp"]}
                      maxSize={5}
                      multiple={true}
                    />
                  </div>

                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      Documents
                    </Label>
                    <p className="text-sm text-gray-600 mb-3">
                      Upload any additional documents like flyers, forms, or
                      information sheets
                    </p>
                    <FileUpload
                      onFileUpload={handleDocumentUpload}
                      acceptedTypes={[".pdf", ".doc", ".docx"]}
                      maxSize={10}
                      multiple={true}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
          </div>
          <div className="flex space-x-2">
            {step < 4 ? (
              <Button onClick={nextStep} disabled={!isStepValid()}>
                Next Step
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setPreviewMode(true)}
                  className="bg-transparent"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSubmit(true)}
                  disabled={isSubmitting}
                  className="bg-transparent"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button
                  onClick={() => handleSubmit(false)}
                  disabled={!isStepValid() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish Opportunity"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
