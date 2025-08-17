"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  Heart,
  Share2,
  Bookmark,
  Building2,
  Tag,
  AlertCircle,
  CheckCircle,
  Eye,
  MessageSquare,
} from "lucide-react";

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

interface DetailedEventModalProps {
  opportunity: Opportunity;
  isOpen: boolean;
  onClose: () => void;
  onApply?: () => void;
}

export default function DetailedEventModal({
  opportunity,
  isOpen,
  onClose,
  onApply,
}: DetailedEventModalProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const spotsRemaining = opportunity.maxVolunteers - opportunity.volunteers;
  const isAlmostFull = spotsRemaining <= 3;
  const isFull = spotsRemaining <= 0;

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
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 pr-8">
            {opportunity.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hero Image */}
          <div className="relative">
            <img
              src={
                opportunity.image ||
                "/placeholder.svg?height=300&width=800&query=volunteer event community service"
              }
              alt={opportunity.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              {opportunity.urgent && (
                <Badge className="bg-red-500 hover:bg-red-600 text-white">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Urgent
                </Badge>
              )}
              <Badge className="bg-white text-gray-900 hover:bg-gray-100">
                <Tag className="h-3 w-3 mr-1" />
                {opportunity.category}
              </Badge>
            </div>
            {isAlmostFull && !isFull && (
              <div className="absolute bottom-4 left-4">
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800"
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Only {spotsRemaining} spots left!
                </Badge>
              </div>
            )}
            {isFull && (
              <div className="absolute bottom-4 left-4">
                <Badge className="bg-gray-500">
                  <Users className="h-3 w-3 mr-1" />
                  Full
                </Badge>
              </div>
            )}
          </div>

          {/* Organization Info */}
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-pink-800" />
            <div>
              <h3 className="font-semibold text-lg text-pink-900">
                {opportunity.organization}
              </h3>
              <p className="text-sm text-gray-600">Verified Organization</p>
            </div>
            <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
          </div>

          <Separator />

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-gray-900">
                Event Details
              </h4>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-gray-600">{opportunity.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-gray-600">{opportunity.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-600">{opportunity.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Volunteers</p>
                    <p className="text-gray-600">
                      {opportunity.volunteers} of {opportunity.maxVolunteers}{" "}
                      registered
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-pink-800 h-2 rounded-full"
                        style={{
                          width: `${
                            (opportunity.volunteers /
                              opportunity.maxVolunteers) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-gray-900">
                Requirements
              </h4>

              <div>
                <p className="font-medium mb-2">Skills Needed</p>
                <div className="flex flex-wrap gap-2">
                  {opportunity.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium mb-2">Quick Stats</h5>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Posted:</span>
                    <span>2 days ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Views:</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      142
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Applications:</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />8
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h4 className="font-semibold text-lg text-gray-900 mb-3">
              About This Opportunity
            </h4>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {opportunity.description}
            </p>
          </div>

          {/* Additional Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">What to Expect</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Orientation and training provided</li>
              <li>• Community service hours certificate available</li>
              <li>• Refreshments and meals included</li>
              <li>• Transportation assistance if needed</li>
            </ul>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="flex-1 bg-pink-800 hover:bg-pink-900"
              onClick={onApply}
              disabled={isFull}
              size="lg"
            >
              {isFull ? "Event Full" : "Apply Now"}
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" size="lg" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
