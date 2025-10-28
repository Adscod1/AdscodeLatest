"use client";

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
import { Plus, Eye, Edit, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type CampaignStatus = "DRAFT" | "PUBLISHED" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";

interface Campaign {
  id: string;
  title: string;
  description: string | null;
  budget: number;
  currency: string;
  status: CampaignStatus;
  createdAt: string;
  _count: {
    applicants: number;
  };
}

const statusColors: Record<CampaignStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  PUBLISHED: "bg-blue-100 text-blue-800",
  ACTIVE: "bg-green-100 text-green-800",
  PAUSED: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-purple-100 text-purple-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const CampaignDashboard = () => {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<CampaignStatus | "ALL">("ALL");
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [campaignToPublish, setCampaignToPublish] = useState<Campaign | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, [filter]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const url = filter === "ALL" 
        ? "/api/campaigns" 
        : `/api/campaigns?status=${filter}`;
      
      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch campaigns");
      }

      setCampaigns(result.campaigns || []);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error("Failed to load campaigns", {
        description: error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    try {
      // Fetch user's store
      const response = await fetch('/api/stores');
      const result = await response.json();
      
      if (result.stores && result.stores.length > 0) {
        const storeId = result.stores[0].id;
        router.push(`/${storeId}/createCampaign`);
      } else {
        toast.error("No store found", {
          description: "Please create a store first to create campaigns.",
        });
      }
    } catch (error) {
      console.error("Error fetching store:", error);
      toast.error("Failed to load store information");
    }
  };

  const handleViewApplicants = (campaignId: string) => {
    router.push(`/campaign/${campaignId}/applicants`);
  };

  const handleEditCampaign = (campaignId: string) => {
    // Route to store-scoped edit page; derive storeId like in handleCreateCampaign
    (async () => {
      try {
        const response = await fetch('/api/stores');
        const result = await response.json();

        if (result.stores && result.stores.length > 0) {
          const storeId = result.stores[0].id;
          router.push(`/${storeId}/campaign/${campaignId}/edit`);
        } else {
          toast.error("No store found", {
            description: "Please create a store first to edit campaigns.",
          });
        }
      } catch (error) {
        console.error("Error fetching store:", error);
        toast.error("Failed to load store information");
      }
    })();
  };

  const handlePublishClick = (campaign: Campaign) => {
    setCampaignToPublish(campaign);
    setPublishDialogOpen(true);
  };

  const handlePublishConfirm = async () => {
    if (!campaignToPublish) return;

    setIsPublishing(true);
    try {
      const response = await fetch(`/api/campaigns/${campaignToPublish.id}/publish`, {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to publish campaign");
      }

      toast.success("Campaign published!", {
        description: "Your campaign is now live and visible to influencers.",
      });

      // Update the campaign in the local state
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaignToPublish.id ? { ...c, status: "PUBLISHED" } : c
        )
      );

      setPublishDialogOpen(false);
      setCampaignToPublish(null);
    } catch (error) {
      console.error("Error publishing campaign:", error);
      toast.error("Failed to publish campaign", {
        description: error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredCampaigns = filter === "ALL" 
    ? campaigns 
    : campaigns.filter(c => c.status === filter);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Campaigns</h1>
          <p className="text-gray-600">
            Manage and track your influencer marketing campaigns
          </p>
        </div>
        <Button
          onClick={handleCreateCampaign}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {campaigns.filter(c => c.status === "ACTIVE").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Published
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {campaigns.filter(c => c.status === "PUBLISHED").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Applicants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.reduce((sum, c) => sum + c._count.applicants, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["ALL", "DRAFT", "PUBLISHED", "ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as CampaignStatus | "ALL")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === status
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status}
            {status !== "ALL" && (
              <span className="ml-1.5 text-xs">
                ({campaigns.filter(c => c.status === status).length})
              </span>
            )}
            {status === "ALL" && (
              <span className="ml-1.5 text-xs">({campaigns.length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Campaigns List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading campaigns...</p>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="pt-6">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
            <p className="text-gray-600 mb-6">
              {filter === "ALL"
                ? "Create your first campaign to get started"
                : `No campaigns with status: ${filter}`}
            </p>
            {filter === "ALL" && (
              <Button
                onClick={handleCreateCampaign}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Campaign
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{campaign.title}</h3>
                      <Badge className={statusColors[campaign.status]}>
                        {campaign.status}
                      </Badge>
                      {campaign._count.applicants > 0 && (
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          {campaign._count.applicants} {campaign._count.applicants === 1 ? "applicant" : "applicants"}
                        </Badge>
                      )}
                    </div>
                    
                    {campaign.description && (
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {campaign.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Budget:</span>{" "}
                        {formatCurrency(campaign.budget, campaign.currency)}
                      </div>
                      <div>
                        <span className="font-medium">Created:</span>{" "}
                        {formatDate(campaign.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-4">
                    {campaign.status === "DRAFT" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCampaign(campaign.id)}
                        className="text-gray-700 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                    
                    {(campaign.status === "PUBLISHED" || campaign.status === "ACTIVE") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewApplicants(campaign.id)}
                        className="text-gray-700 hover:text-blue-600"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Applicants
                      </Button>
                    )}

                    {campaign.status === "DRAFT" && (
                      <Button
                        size="sm"
                        onClick={() => handlePublishClick(campaign)}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Publish
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Publish Confirmation Dialog */}
      <AlertDialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to publish &quot;{campaignToPublish?.title}&quot;? 
              Once published, this campaign will be visible to all approved influencers 
              and they can start applying.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPublishing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePublishConfirm}
              disabled={isPublishing}
              className="bg-green-500 hover:bg-green-600"
            >
              {isPublishing ? "Publishing..." : "Publish Campaign"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CampaignDashboard;
