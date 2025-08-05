"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  Heart,
  Share2,
  Bookmark,
  Eye,
} from "lucide-react";
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
  image?: string;
  urgent?: boolean;
}

interface OpportunityCardProps {
  opportunity: Opportunity;
  onApply?: (opportunityId: number, applicationData: any) => void;
  showFullDescription?: boolean;
}

export default function OpportunityCard({
  opportunity,
  onApply,
  showFullDescription = false,
}: OpportunityCardProps) {
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleApply = () => {
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = (applicationData: any) => {
    if (onApply) {
      onApply(opportunity.id, applicationData);
    }
    setShowApplicationModal(false);
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: opportunity.title,
        text: `Check out this volunteer opportunity: ${opportunity.title} with ${opportunity.organization}`,
        url: window.location.href,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const spotsRemaining = opportunity.maxVolunteers - opportunity.volunteers;
  const isAlmostFull = spotsRemaining <= 3;
  const isFull = spotsRemaining <= 0;

  return (
    <>
      <Card className="border-pink-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="relative">
            <img
              src={opportunity.image || "/placeholder.svg?height=200&width=400"}
              alt={opportunity.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              {opportunity.urgent && (
                <Badge className="bg-red-500 hover:bg-red-600">Urgent</Badge>
              )}
              <Badge className="bg-white text-gray-900 hover:bg-gray-100">
                {opportunity.category}
              </Badge>
            </div>
            <div className="absolute top-3 right-3 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                onClick={handleFavorite}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
                  }`}
                />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                onClick={handleBookmark}
              >
                <Bookmark
                  className={`h-4 w-4 ${
                    isBookmarked
                      ? "fill-blue-500 text-blue-500"
                      : "text-gray-600"
                  }`}
                />
              </Button>
            </div>
            {isAlmostFull && !isFull && (
              <div className="absolute bottom-3 left-3">
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800"
                >
                  Only {spotsRemaining} spots left!
                </Badge>
              </div>
            )}
            {isFull && (
              <div className="absolute bottom-3 left-3">
                <Badge className="bg-gray-500">Full</Badge>
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                {opportunity.title}
              </h3>
              <Badge variant="outline" className="ml-2 shrink-0">
                {opportunity.volunteers}/{opportunity.maxVolunteers}
              </Badge>
            </div>

            <p className="text-indigo-600 font-medium mb-3">
              {opportunity.organization}
            </p>

            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
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
                {spotsRemaining} spots left
              </div>
            </div>

            <p
              className={`text-gray-700 mb-4 ${
                showFullDescription ? "" : "line-clamp-2"
              }`}
            >
              {opportunity.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {opportunity.skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {opportunity.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{opportunity.skills.length - 3} more
                </Badge>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={handleApply}
                disabled={isFull}
              >
                {isFull ? "Full" : "Apply Now"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="px-3 bg-transparent"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="px-3 bg-transparent"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Posted 2 days ago</span>
                <span>142 views</span>
                <span>8 applications</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ApplicationModal
        opportunity={opportunity}
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        onSubmit={handleApplicationSubmit}
      />
    </>
  );
}
