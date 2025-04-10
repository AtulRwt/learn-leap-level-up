
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users, Clock, Search, Plus } from "lucide-react";

const Forums = () => {
  const forumTopics = [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold">Discussion Forums</h1>
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search discussions..." className="pl-8" />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> New Topic
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Topics</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {forumTopics.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p>No forum topics available. Start the conversation!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="popular" className="space-y-4">
            <Card>
              <CardContent className="p-8 text-center">
                <p>No popular topics at the moment.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardContent className="p-8 text-center">
                <p>No recent topics found.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="unanswered" className="space-y-4">
            <Card>
              <CardContent className="p-8 text-center">
                <p>No unanswered topics.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default PremiumContent;
