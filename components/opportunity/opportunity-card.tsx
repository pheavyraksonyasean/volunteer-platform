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
import { MapPin, Clock, Users, Calendar, Eye, Heart, Share2, CheckCircle } from "lucide-react";
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
  isVerifiedOrg?: boolean;
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

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: opportunity.title,
        text: opportunity.description,
        url: window.location.href,
      });
    }
  };

  const progressPercentage =
    (opportunity.volunteers / opportunity.maxVolunteers) * 100;
  const spotsLeft = opportunity.maxVolunteers - opportunity.volunteers;
  const urgencyLevel = spotsLeft <= 5 ? 'high' : spotsLeft <= 15 ? 'medium' : 'low';

  return (
    <>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-1 bg-white">
        <div className="relative overflow-hidden">
          <img
            src={opportunity.image || "/placeholder.svg"}
            alt={opportunity.title}
            className="w-full h-48 sm:h-52 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Category Badge */}
          <Badge className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 border-0 shadow-sm">
            {opportunity.category}
          </Badge>
          
          {/* Urgency Indicator */}
          {urgencyLevel === 'high' && (
            <Badge className="absolute top-3 right-3 bg-red-500 text-white border-0 shadow-sm animate-pulse">
              Few spots left!
            </Badge>
          )}
          
          {/* Action buttons overlay */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleLike}
              className={`w-8 h-8 rounded-full backdrop-blur-sm border-0 shadow-sm transition-colors flex items-center justify-center ${
                isLiked 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-blue-50 hover:text-blue-500 border-0 shadow-sm transition-colors flex items-center justify-center"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
          
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardHeader className="pb-3 px-4 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-pink-700 transition-colors">
                {opportunity.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 text-pink-700 font-semibold mt-1">
                {opportunity.organization}
                {opportunity.isVerifiedOrg && (
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
          {/* Event Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center text-gray-600 group-hover:text-gray-700 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center mr-3 group-hover:bg-pink-100 transition-colors">
                <MapPin className="h-4 w-4 text-pink-600" />
              </div>
              <span className="truncate">{opportunity.location}</span>
            </div>
            
            <div className="flex items-center text-gray-600 group-hover:text-gray-700 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <span>{opportunity.date}</span>
            </div>
            
            <div className="flex items-center text-gray-600 group-hover:text-gray-700 transition-colors sm:col-span-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center mr-3 group-hover:bg-purple-100 transition-colors">
                <Clock className="h-4 w-4 text-purple-600" />
              </div>
              <span>{opportunity.time}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
            {opportunity.description}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {opportunity.skills.slice(0, 3).map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {skill}
              </Badge>
            ))}
            {opportunity.skills.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-500">
                +{opportunity.skills.length - 3} more
              </Badge>
            )}
          </div>

          {/* Volunteer Progress with enhanced styling */}
          <div className="space-y-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm font-medium text-gray-700">
                <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mr-2">
                  <Users className="h-3 w-3 text-pink-600" />
                </div>
                {opportunity.volunteers}/{opportunity.maxVolunteers} volunteers
              </div>
              <span className={`text-sm font-semibold ${
                urgencyLevel === 'high' 
                  ? 'text-red-600' 
                  : urgencyLevel === 'medium' 
                    ? 'text-orange-600' 
                    : 'text-green-600'
              }`}>
                {spotsLeft} spots left
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  urgencyLevel === 'high' 
                    ? 'bg-gradient-to-r from-red-400 to-red-500' 
                    : urgencyLevel === 'medium'
                      ? 'bg-gradient-to-r from-orange-400 to-orange-500'
                      : 'bg-gradient-to-r from-pink-500 to-pink-600'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              className="flex-1 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white border-0 shadow-sm transition-all duration-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={spotsLeft === 0}
              onClick={() => setIsApplyModalOpen(true)}
            >
              {spotsLeft === 0 ? "Fully Booked" : "Apply Now"}
            </Button>

            <Button
              variant="outline"
              size="default"
              className="px-4 border-gray-200 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 transition-all duration-300"
              onClick={handleViewDetails}
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Details</span>
            </Button>
          </div>

          {/* Mobile-specific urgency message */}
          {urgencyLevel === 'high' && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg sm:hidden">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm text-red-700 font-medium">
                Only {spotsLeft} spots remaining - apply soon!
              </span>
            </div>
          )}
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