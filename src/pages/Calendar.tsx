
import React from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layout/MainLayout";
import { addDays } from "date-fns";

const Calendar = () => {
  const date = new Date();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);

  // Sample events for demonstration
  const events = [
    { 
      id: 1, 
      title: "Study Group: Mathematics", 
      date: date, 
      time: "10:00 - 11:30", 
      type: "study-group" 
    },
    { 
      id: 2, 
      title: "Lecture: Computer Science", 
      date: addDays(date, 1), 
      time: "14:00 - 15:30", 
      type: "lecture" 
    },
    { 
      id: 3, 
      title: "Assignment Due: Physics", 
      date: addDays(date, 3), 
      time: "23:59", 
      type: "deadline" 
    },
    { 
      id: 4, 
      title: "Meeting with Prof. Smith", 
      date: addDays(date, 2), 
      time: "15:00 - 15:30", 
      type: "meeting" 
    },
  ];

  // Filter events for selected date
  const selectedDateEvents = selectedDate 
    ? events.filter(
        event => 
          event.date.getDate() === selectedDate.getDate() &&
          event.date.getMonth() === selectedDate.getMonth() &&
          event.date.getFullYear() === selectedDate.getFullYear()
      )
    : [];

  // Badge styles based on event type
  const getEventBadgeStyle = (type: string) => {
    switch (type) {
      case "study-group": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "lecture": return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "deadline": return "bg-red-100 text-red-800 hover:bg-red-100";
      case "meeting": return "bg-green-100 text-green-800 hover:bg-green-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

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
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateEvents.map(event => (
                    <div key={event.id} className="flex flex-col p-4 border rounded-md">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{event.title}</h3>
                        <Badge className={getEventBadgeStyle(event.type)}>
                          {event.type.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Time: {event.time}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  {selectedDate 
                    ? "No events scheduled for this date."
                    : "Please select a date to view events."}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Calendar;
