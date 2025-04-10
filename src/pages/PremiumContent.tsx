import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Crown, Download, Check, BookOpen, Video, FileText, Award } from "lucide-react";
import { toast } from "@/lib/toast";

const PremiumContent = () => {
  const { user } = useAuth();
  const isPremium = user?.isPremium || false;

  const premiumResources = [
    {
      id: 1,
      title: "Advanced Algorithm Analysis",
      type: "Notes",
      description: "Comprehensive notes on advanced algorithm techniques with examples",
      icon: FileText,
      new: true,
    },
    {
      id: 2,
      title: "Database Systems Master Class",
      type: "Video",
      description: "In-depth video lectures on database optimization and architecture",
      icon: Video,
      new: false,
    },
    {
      id: 3,
      title: "Machine Learning Interview Guide",
      type: "Guide",
      description: "Preparation guide for machine learning interviews at top companies",
      icon: BookOpen,
      new: true,
    },
    {
      id: 4,
      title: "System Design for Scalable Applications",
      type: "Notes",
      description: "Learn how to design large-scale distributed systems",
      icon: FileText,
      new: false,
    },
  ];

  const premiumBenefits = [
    "Access to exclusive study materials",
    "Video tutorials and lectures",
    "Mock interview sessions",
    "Advanced topic guides",
    "Early access to new resources",
    "Priority support from admins",
  ];

  const handleDownload = (resourceId: number) => {
    toast.success("Starting download...");
  };

  const handleUpgrade = () => {
    toast.info("Redirecting to premium subscription page...");
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Premium Learning Resources</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access exclusive, high-quality study materials prepared by experts to accelerate your learning journey
          </p>
        </div>

        {!isPremium && (
          <Card className="border-primary/30 bg-primary/5 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                <span>Upgrade to Premium</span>
              </CardTitle>
              <CardDescription>
                Unlock all premium resources and features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Premium Benefits</h3>
                  <ul className="space-y-2">
                    {premiumBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-card p-6 rounded-lg text-center flex flex-col justify-center">
                  <div className="text-3xl font-bold mb-2">49 points/month</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Use your earned points or subscribe directly
                  </p>
                  <Button
                    onClick={handleUpgrade}
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {premiumResources.map((resource) => (
            <Card
              key={resource.id}
              className={isPremium ? "" : "opacity-75"}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="bg-primary/10 p-2 rounded">
                    <resource.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex gap-2">
                    {resource.new && (
                      <Badge className="bg-green-500">New</Badge>
                    )}
                    {!isPremium && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        <span>Premium</span>
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="mt-3 text-lg">{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  variant={isPremium ? "default" : "outline"}
                  className="w-full"
                  disabled={!isPremium}
                  onClick={() => isPremium && handleDownload(resource.id)}
                >
                  {isPremium ? (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Resource
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Premium Only
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {isPremium && (
          <div className="flex items-center justify-center p-6 bg-primary/5 rounded-lg mt-6">
            <div className="flex items-center gap-2 text-sm">
              <Award className="h-4 w-4 text-amber-500" />
              <span>
                You're a premium member! New resources are added weekly.
              </span>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PremiumContent;
