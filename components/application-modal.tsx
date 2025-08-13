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
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Upload,
  CheckCircle,
  X,
} from "lucide-react";
import FileUpload from "./file-upload";

interface Opportunity {
  id: number;
  title: string;
  organization: string;
  location: string;
  date: string;
  time: string;
  volunteers: number;
  maxVolunteers: number;
  skills: string[];
  category: string;
  description: string;
  requirements?: string[];
  image?: string;
  urgent?: boolean;
}

interface ApplicationModalProps {
  opportunity: Opportunity;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (applicationData: any) => void;
}

export default function ApplicationModal({
  opportunity,
  isOpen,
  onClose,
  onSubmit,
}: ApplicationModalProps) {
  const [step, setStep] = useState(1);
  const [applicationData, setApplicationData] = useState({
    motivation: "",
    experience: "",
    availability: "",
    skills: [] as string[],
    emergencyContact: "",
    emergencyPhone: "",
    hasTransportation: false,
    agreeToBackground: false,
    agreeToCommitment: false,
    resume: null as File | null,
    additionalDocuments: [] as File[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSkillToggle = (skill: string) => {
    setApplicationData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setApplicationData((prev) => ({
        ...prev,
        resume: files[0],
      }));
    }
  };

  const handleAdditionalFilesUpload = (files: File[]) => {
    setApplicationData((prev) => ({
      ...prev,
      additionalDocuments: [...prev.additionalDocuments, ...files],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    onSubmit({
      opportunityId: opportunity.id,
      ...applicationData,
    });

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Close modal after showing success
    setTimeout(() => {
      setIsSubmitted(false);
      setStep(1);
      onClose();
    }, 3000);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const isStepValid = () => {
    switch (step) {
      case 1:
        return (
          applicationData.motivation.length > 50 &&
          applicationData.experience.length > 20
        );
      case 2:
        return (
          applicationData.availability && applicationData.skills.length > 0
        );
      case 3:
        return (
          applicationData.emergencyContact &&
          applicationData.emergencyPhone &&
          applicationData.agreeToBackground &&
          applicationData.agreeToCommitment
        );
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
              Application Submitted!
            </h3>
            <p className="text-gray-600 mb-4">
              Your application for <strong>{opportunity.title}</strong> has been
              successfully submitted.
            </p>
            <p className="text-sm text-gray-500">
              You'll receive an email confirmation shortly, and the organization
              will review your application within 2-3 business days.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Apply for Volunteer Opportunity
          </DialogTitle>
          <DialogDescription>
            Complete your application to volunteer with{" "}
            {opportunity.organization}
          </DialogDescription>
        </DialogHeader>

        {/* Opportunity Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <img
                src={opportunity.image || "/placeholder.svg?height=80&width=80"}
                alt={opportunity.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {opportunity.title}
                </h3>
                <p className="text-pink-600 font-medium">
                  {opportunity.organization}
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-2">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {opportunity.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {opportunity.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {opportunity.time}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {opportunity.volunteers}/{opportunity.maxVolunteers}{" "}
                    volunteers
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
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
                {stepNumber < 3 && (
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

        {/* Step Content */}
        <div className="space-y-6">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Tell Us About Yourself</CardTitle>
                <CardDescription>
                  Help us understand your motivation and experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="motivation">
                    Why do you want to volunteer for this opportunity? *
                  </Label>
                  <Textarea
                    id="motivation"
                    placeholder="Share your motivation and what you hope to achieve..."
                    value={applicationData.motivation}
                    onChange={(e) =>
                      setApplicationData((prev) => ({
                        ...prev,
                        motivation: e.target.value,
                      }))
                    }
                    rows={4}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {applicationData.motivation.length}/50 characters minimum
                  </p>
                </div>

                <div>
                  <Label htmlFor="experience">Relevant Experience *</Label>
                  <Textarea
                    id="experience"
                    placeholder="Describe any relevant experience, skills, or previous volunteer work..."
                    value={applicationData.experience}
                    onChange={(e) =>
                      setApplicationData((prev) => ({
                        ...prev,
                        experience: e.target.value,
                      }))
                    }
                    rows={4}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {applicationData.experience.length}/20 characters minimum
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Skills & Availability</CardTitle>
                <CardDescription>
                  Let us know about your skills and when you're available
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Your Skills *</Label>
                  <p className="text-sm text-gray-600 mb-3">
                    Select all skills that apply to you
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
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
                    ].map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={applicationData.skills.includes(skill)}
                          onCheckedChange={() => handleSkillToggle(skill)}
                        />
                        <Label htmlFor={skill} className="text-sm">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {applicationData.skills.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">
                        Selected Skills:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {applicationData.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="availability">Availability *</Label>
                  <Select
                    value={applicationData.availability}
                    onValueChange={(value) =>
                      setApplicationData((prev) => ({
                        ...prev,
                        availability: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekdays">Weekdays</SelectItem>
                      <SelectItem value="weekends">Weekends</SelectItem>
                      <SelectItem value="evenings">Evenings</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                      <SelectItem value="once-week">Once a week</SelectItem>
                      <SelectItem value="multiple-week">
                        Multiple times a week
                      </SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="transportation"
                    checked={applicationData.hasTransportation}
                    onCheckedChange={(checked) =>
                      setApplicationData((prev) => ({
                        ...prev,
                        hasTransportation: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="transportation" className="text-sm">
                    I have reliable transportation to the volunteer location
                  </Label>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact & Documents</CardTitle>
                  <CardDescription>
                    Final details to complete your application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyContact">
                        Emergency Contact Name *
                      </Label>
                      <Input
                        id="emergencyContact"
                        value={applicationData.emergencyContact}
                        onChange={(e) =>
                          setApplicationData((prev) => ({
                            ...prev,
                            emergencyContact: e.target.value,
                          }))
                        }
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyPhone">
                        Emergency Contact Phone *
                      </Label>
                      <Input
                        id="emergencyPhone"
                        type="tel"
                        value={applicationData.emergencyPhone}
                        onChange={(e) =>
                          setApplicationData((prev) => ({
                            ...prev,
                            emergencyPhone: e.target.value,
                          }))
                        }
                        placeholder="Phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      Upload Resume (Optional)
                    </Label>
                    <FileUpload
                      onFileUpload={handleFileUpload}
                      acceptedTypes={[".pdf", ".doc", ".docx"]}
                      maxSize={5}
                      multiple={false}
                    />
                  </div>

                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      Additional Documents (Optional)
                    </Label>
                    <p className="text-sm text-gray-600 mb-3">
                      Upload any additional documents like certifications,
                      references, or cover letter
                    </p>
                    <FileUpload
                      onFileUpload={handleAdditionalFilesUpload}
                      acceptedTypes={[".pdf", ".doc", ".docx", ".jpg", ".png"]}
                      maxSize={5}
                      multiple={true}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Agreements & Consent</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="background"
                      checked={applicationData.agreeToBackground}
                      onCheckedChange={(checked) =>
                        setApplicationData((prev) => ({
                          ...prev,
                          agreeToBackground: checked as boolean,
                        }))
                      }
                    />
                    <Label
                      htmlFor="background"
                      className="text-sm leading-relaxed"
                    >
                      I consent to a background check if required by the
                      organization *
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="commitment"
                      checked={applicationData.agreeToCommitment}
                      onCheckedChange={(checked) =>
                        setApplicationData((prev) => ({
                          ...prev,
                          agreeToCommitment: checked as boolean,
                        }))
                      }
                    />
                    <Label
                      htmlFor="commitment"
                      className="text-sm leading-relaxed"
                    >
                      I understand the time commitment and agree to fulfill my
                      volunteer responsibilities *
                    </Label>
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
            {step < 3 ? (
              <Button onClick={nextStep} disabled={!isStepValid()}>
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
