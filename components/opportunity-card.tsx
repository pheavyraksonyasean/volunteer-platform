"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Calendar, Eye } from "lucide-react";
import DetailedEventModal from "./DetailedEventModal";
import ApplicationModal from "./application-modal";

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
  image: string;
}

interface OpportunityCardProps {
  opportunity: Opportunity;
  onApply: (opportunityId: number, applicationData: any) => void;
}

export default function OpportunityCard({
  opportunity,
  onApply,
}: OpportunityCardProps) {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleApply = (applicationData: any) => {
    onApply(opportunity.id, applicationData);
    setIsApplyModalOpen(false);
  };

  const handleViewDetails = () => {
    setIsDetailModalOpen(true);
  };

  const progressPercentage =
    (opportunity.volunteers / opportunity.maxVolunteers) * 100;
  const spotsLeft = opportunity.maxVolunteers - opportunity.volunteers;

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 border-pink-200">
        <div className="relative">
          <img
            src={opportunity.image || "/placeholder.svg"}
            alt={opportunity.title}
            className="w-full h-48 object-cover"
          />

          <Badge className="absolute top-2 left-2 bg-white text-pink-950">
            {opportunity.category}
          </Badge>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                {opportunity.title}
              </CardTitle>
              <CardDescription className="text-pink-800 font-medium">
                {opportunity.organization}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Location and Date */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              {opportunity.location}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              {opportunity.date}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-gray-400" />
              {opportunity.time}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 line-clamp-2">
            {opportunity.description}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-1">
            {opportunity.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>

          {/* Volunteer Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                {opportunity.volunteers}/{opportunity.maxVolunteers} volunteers
              </div>
              <span className="text-gray-500">{spotsLeft} spots left</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-pink-800 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1 bg-pink-800 hover:bg-pink-700 text-white"
              disabled={spotsLeft === 0}
              onClick={() => setIsApplyModalOpen(true)}
            >
              {spotsLeft === 0 ? "Fully Booked" : "Apply Now"}
            </Button>

            <Button
              variant="outline"
              size="default"
              className="px-4 bg-transparent"
              onClick={handleViewDetails}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <ApplicationModal
        opportunity={opportunity}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmit={handleApply}
      />

      <DetailedEventModal
        opportunity={opportunity}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onApply={() => {
          setIsDetailModalOpen(false);
          setIsApplyModalOpen(true);
        }}
      />
    </>
  );
}
