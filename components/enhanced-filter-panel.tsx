"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { X, CalendarIcon, MapPin, Clock, Users, Star, Zap, Filter, RotateCcw } from "lucide-react"
import { format } from "date-fns"

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: any) => void
  currentFilters: any
}

export default function EnhancedFilterPanel({ isOpen, onClose, onApplyFilters, currentFilters }: FilterPanelProps) {
  const [filters, setFilters] = useState({
    categories: [] as string[],
    skills: [] as string[],
    locations: [] as string[],
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined,
    },
    timeOfDay: [] as string[],
    duration: [1, 8] as number[],
    volunteerCount: [1, 50] as number[],
    urgentOnly: false,
    remoteOnly: false,
    weekendsOnly: false,
    recurringOnly: false,
    backgroundCheckRequired: false,
    minAge: 16,
    benefits: [] as string[],
    organizationType: [] as string[],
    ...currentFilters,
  })

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
  ]

  const skills = [
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
  ]

  const locations = [
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Philadelphia, PA",
    "San Antonio, TX",
    "San Diego, CA",
    "Dallas, TX",
    "San Jose, CA",
  ]

  const timeOfDayOptions = ["Morning (6AM-12PM)", "Afternoon (12PM-6PM)", "Evening (6PM-10PM)", "Night (10PM-6AM)"]

  const benefits = [
    "Community Service Hours",
    "Training Provided",
    "Meals Included",
    "Transportation Provided",
    "Certificate of Completion",
    "Reference Letter",
    "Networking Opportunities",
    "Skill Development",
  ]

  const organizationTypes = [
    "Non-profit",
    "Charity",
    "Community Group",
    "Religious Organization",
    "Educational Institution",
    "Healthcare",
    "Government",
  ]

  const handleArrayToggle = (array: string[], item: string, field: string) => {
    const newArray = array.includes(item) ? array.filter((i) => i !== item) : [...array, item]

    setFilters((prev) => ({ ...prev, [field]: newArray }))
  }

  const handleApply = () => {
    onApplyFilters(filters)
    onClose()
  }

  const handleReset = () => {
    const resetFilters = {
      categories: [],
      skills: [],
      locations: [],
      dateRange: { from: undefined, to: undefined },
      timeOfDay: [],
      duration: [1, 8],
      volunteerCount: [1, 50],
      urgentOnly: false,
      remoteOnly: false,
      weekendsOnly: false,
      recurringOnly: false,
      backgroundCheckRequired: false,
      minAge: 16,
      benefits: [],
      organizationType: [],
    }
    setFilters(resetFilters)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.categories.length > 0) count++
    if (filters.skills.length > 0) count++
    if (filters.locations.length > 0) count++
    if (filters.dateRange.from || filters.dateRange.to) count++
    if (filters.timeOfDay.length > 0) count++
    if (filters.urgentOnly) count++
    if (filters.remoteOnly) count++
    if (filters.weekendsOnly) count++
    if (filters.recurringOnly) count++
    if (filters.backgroundCheckRequired) count++
    if (filters.benefits.length > 0) count++
    if (filters.organizationType.length > 0) count++
    return count
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Advanced Filters
            </CardTitle>
            <CardDescription>Refine your search to find the perfect volunteer opportunities</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick Filters */}
          <div>
            <Label className="text-base font-medium mb-3 block">Quick Filters</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filters.urgentOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, urgentOnly: !prev.urgentOnly }))}
                className="h-8"
              >
                <Zap className="h-3 w-3 mr-1" />
                Urgent Only
              </Button>
              <Button
                variant={filters.remoteOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, remoteOnly: !prev.remoteOnly }))}
                className="h-8"
              >
                🏠 Remote Only
              </Button>
              <Button
                variant={filters.weekendsOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, weekendsOnly: !prev.weekendsOnly }))}
                className="h-8"
              >
                📅 Weekends Only
              </Button>
              <Button
                variant={filters.recurringOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, recurringOnly: !prev.recurringOnly }))}
                className="h-8"
              >
                🔄 Recurring
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categories */}
            <div>
              <Label className="text-base font-medium mb-3 block">Categories</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => handleArrayToggle(filters.categories, category, "categories")}
                    />
                    <Label htmlFor={category} className="text-sm">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <Label className="text-base font-medium mb-3 block">Skills</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {skills.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={filters.skills.includes(skill)}
                      onCheckedChange={() => handleArrayToggle(filters.skills, skill, "skills")}
                    />
                    <Label htmlFor={skill} className="text-sm">
                      {skill}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div>
              <Label className="text-base font-medium mb-3 block">Locations</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {locations.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={location}
                      checked={filters.locations.includes(location)}
                      onCheckedChange={() => handleArrayToggle(filters.locations, location, "locations")}
                    />
                    <Label htmlFor={location} className="text-sm">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {location}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Time of Day */}
            <div>
              <Label className="text-base font-medium mb-3 block">Time of Day</Label>
              <div className="space-y-2">
                {timeOfDayOptions.map((time) => (
                  <div key={time} className="flex items-center space-x-2">
                    <Checkbox
                      id={time}
                      checked={filters.timeOfDay.includes(time)}
                      onCheckedChange={() => handleArrayToggle(filters.timeOfDay, time, "timeOfDay")}
                    />
                    <Label htmlFor={time} className="text-sm">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {time}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <Label className="text-base font-medium mb-3 block">Date Range</Label>
            <div className="flex gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.from ? format(filters.dateRange.from, "PPP") : "From date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.from}
                    onSelect={(date) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, from: date },
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.to ? format(filters.dateRange.to, "PPP") : "To date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.to}
                    onSelect={(date) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, to: date },
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Duration Range */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Duration: {filters.duration[0]}h - {filters.duration[1]}h
            </Label>
            <Slider
              value={filters.duration}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, duration: value }))}
              max={12}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          {/* Volunteer Count Range */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              <Users className="h-4 w-4 inline mr-1" />
              Volunteers Needed: {filters.volunteerCount[0]} - {filters.volunteerCount[1]}
            </Label>
            <Slider
              value={filters.volunteerCount}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, volunteerCount: value }))}
              max={100}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          {/* Additional Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-base font-medium mb-3 block">Benefits Offered</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center space-x-2">
                    <Checkbox
                      id={benefit}
                      checked={filters.benefits.includes(benefit)}
                      onCheckedChange={() => handleArrayToggle(filters.benefits, benefit, "benefits")}
                    />
                    <Label htmlFor={benefit} className="text-sm">
                      <Star className="h-3 w-3 inline mr-1" />
                      {benefit}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">Organization Type</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {organizationTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={filters.organizationType.includes(type)}
                      onCheckedChange={() => handleArrayToggle(filters.organizationType, type, "organizationType")}
                    />
                    <Label htmlFor={type} className="text-sm">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Settings */}
          <div>
            <Label className="text-base font-medium mb-3 block">Additional Requirements</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="backgroundCheck"
                  checked={filters.backgroundCheckRequired}
                  onCheckedChange={(checked) =>
                    setFilters((prev) => ({ ...prev, backgroundCheckRequired: checked as boolean }))
                  }
                />
                <Label htmlFor="backgroundCheck" className="text-sm">
                  Background check required
                </Label>
              </div>
              <div>
                <Label htmlFor="minAge" className="text-sm">
                  Minimum Age: {filters.minAge}
                </Label>
                <Select
                  value={filters.minAge.toString()}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, minAge: Number.parseInt(value) }))}
                >
                  <SelectTrigger className="w-32 mt-1">
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
          </div>

          {/* Active Filters Summary */}
          {getActiveFilterCount() > 0 && (
            <div>
              <Label className="text-base font-medium mb-3 block">Active Filters ({getActiveFilterCount()})</Label>
              <div className="flex flex-wrap gap-2">
                {filters.categories.map((cat) => (
                  <Badge
                    key={cat}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleArrayToggle(filters.categories, cat, "categories")}
                  >
                    {cat} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
                {filters.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleArrayToggle(filters.skills, skill, "skills")}
                  >
                    {skill} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
                {filters.urgentOnly && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setFilters((prev) => ({ ...prev, urgentOnly: false }))}
                  >
                    Urgent Only <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>

        {/* Footer Actions */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={handleReset} className="bg-transparent">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset All
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleApply}>
              Apply Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
