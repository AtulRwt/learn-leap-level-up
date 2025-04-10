
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Video, BookOpen } from "lucide-react";

const PremiumContent = () => {
  const resources = [];

  return (
    <MainLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Learning Resources</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access quality study materials to accelerate your learning journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {resources.length === 0 && (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No premium resources available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default PremiumContent;
