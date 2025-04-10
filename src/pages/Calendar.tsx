
import React from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layout/MainLayout";

const Calendar = () => {
  const date = new Date();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);

  const events: any[] = [];

  const selectedDateEvents = [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Academic Calendar</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedDate ? (
                  <>Events for {selectedDate.toLocaleDateString()}</>
                ) : (
                  <>Select a date</>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  {selectedDate 
                    ? "No events scheduled for this date."
                    : "Please select a date to view events."}
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Calendar;
