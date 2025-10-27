"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, User, Calendar, Users, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface Social {
  platform: string;
  username: string;
  followersCount: number;
  isVerified: boolean;
}

interface Influencer {
  id: string;
  userId: string;
  fullName: string;
  profilePicture: string | null;
  bio: string | null;
  primaryNiche: string | null;
  status: string;
  socials: Social[];
  totalFollowers: number;
}

interface Applicant {
  id: string;
  applicationStatus: string;
  appliedAt: string;
  selectedAt: string | null;
  influencer: Influencer;
}

interface Campaign {
  id: string;
  title: string;
}

const applicationStatusColors: Record<string, string> = {
  APPLIED: "bg-yellow-100 text-yellow-800",
  SELECTED: "bg-green-100 text-green-800",
  NOT_SELECTED: "bg-gray-100 text-gray-800",
  WITHDRAWN: "bg-red-100 text-red-800",
};

const CampaignApplicantsPage = () => {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);
  const [applicantToSelect, setApplicantToSelect] = useState<Applicant | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    if (campaignId) {
      fetchApplicants();
    }
  }, [campaignId]);

  const fetchApplicants = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/applicants`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch applicants");
      }

      setCampaign(result.campaign);
      setApplicants(result.applicants || []);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      toast.error("Failed to load applicants", {
        description: error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectClick = (applicant: Applicant) => {
    setApplicantToSelect(applicant);
    setSelectDialogOpen(true);
  };

  const handleSelectConfirm = async () => {
    if (!applicantToSelect) return;

    setIsSelecting(true);
    try {
      const response = await fetch(
        `/api/campaigns/${campaignId}/applicants/${applicantToSelect.influencer.id}/select`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to select influencer");
      }

      toast.success("Influencer selected!", {
        description: `${applicantToSelect.influencer.fullName} has been selected for this campaign.`,
      });

      // Optimistically update the UI
      setApplicants((prev) =>
        prev.map((app) =>
          app.id === applicantToSelect.id
            ? { ...app, applicationStatus: "SELECTED", selectedAt: new Date().toISOString() }
            : app
        )
      );

      setSelectDialogOpen(false);
      setApplicantToSelect(null);
    } catch (error) {
      console.error("Error selecting influencer:", error);
      toast.error("Failed to select influencer", {
        description: error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setIsSelecting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getPlatformIcon = (platform: string) => {
    // You can replace these with actual icons if available
    const icons: Record<string, string> = {
      instagram: "📷",
      tiktok: "🎵",
      youtube: "▶️",
      twitter: "🐦",
      facebook: "📘",
    };
    return icons[platform.toLowerCase()] || "🌐";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading applicants...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/campaign")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Campaigns
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaign Applicants</h1>
            {campaign && (
              <p className="text-gray-600 mt-2">
                Viewing applicants for: <span className="font-semibold">{campaign.title}</span>
              </p>
            )}
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {applicants.length} {applicants.length === 1 ? "Applicant" : "Applicants"}
          </Badge>
        </div>
      </div>

      {/* Applicants List */}
      {applicants.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No applicants yet</h3>
            <p className="text-gray-600">
              When influencers apply to your campaign, they'll appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applicants.map((applicant) => (
            <Card key={applicant.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  {/* Influencer Info */}
                  <div className="flex gap-4 flex-1">
                    {/* Profile Picture */}
                    <div className="flex-shrink-0">
                      {applicant.influencer.profilePicture ? (
                        <img
                          src={applicant.influencer.profilePicture}
                          alt={applicant.influencer.fullName}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {applicant.influencer.fullName}
                        </h3>
                        <Badge className={applicationStatusColors[applicant.applicationStatus]}>
                          {applicant.applicationStatus === "APPLIED" && "Pending"}
                          {applicant.applicationStatus === "SELECTED" && "Selected"}
                          {applicant.applicationStatus === "NOT_SELECTED" && "Not Selected"}
                          {applicant.applicationStatus === "WITHDRAWN" && "Withdrawn"}
                        </Badge>
                      </div>

                      {applicant.influencer.primaryNiche && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Niche:</span> {applicant.influencer.primaryNiche}
                        </p>
                      )}

                      {applicant.influencer.bio && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {applicant.influencer.bio}
                        </p>
                      )}

                      {/* Social Media Stats */}
                      <div className="flex flex-wrap gap-3 mb-3">
                        {applicant.influencer.socials.map((social, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-sm">
                            <span>{getPlatformIcon(social.platform)}</span>
                            <span className="font-medium">
                              {formatFollowers(social.followersCount)}
                            </span>
                            {social.isVerified && <span className="text-blue-500">✓</span>}
                          </div>
                        ))}
                      </div>

                      {/* Total Followers */}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>Total Followers: </span>
                        <span className="font-semibold">
                          {formatFollowers(applicant.influencer.totalFollowers)}
                        </span>
                      </div>

                      {/* Application Date */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                        <Calendar className="h-4 w-4" />
                        <span>Applied on {formatDate(applicant.appliedAt)}</span>
                      </div>

                      {applicant.selectedAt && (
                        <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>Selected on {formatDate(applicant.selectedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0 ml-4">
                    {applicant.applicationStatus === "APPLIED" ? (
                      <Button
                        onClick={() => handleSelectClick(applicant)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Select
                      </Button>
                    ) : applicant.applicationStatus === "SELECTED" ? (
                      <Badge className="bg-green-100 text-green-800 px-4 py-2">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Selected
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="px-4 py-2">
                        {applicant.applicationStatus}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Selection Confirmation Dialog */}
      <AlertDialog open={selectDialogOpen} onOpenChange={setSelectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Select Influencer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to select{" "}
              <span className="font-semibold">{applicantToSelect?.influencer.fullName}</span> for
              this campaign? They will be notified of your selection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSelecting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSelectConfirm}
              disabled={isSelecting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSelecting ? "Selecting..." : "Confirm Selection"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CampaignApplicantsPage;
