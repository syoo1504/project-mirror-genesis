import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const activities = [
  {
    id: 1,
    user: "Alice Johnson",
    action: "created a new project",
    time: "2 minutes ago",
    avatar: "/placeholder.svg",
    initials: "AJ",
  },
  {
    id: 2,
    user: "Bob Smith",
    action: "updated dashboard settings",
    time: "10 minutes ago",
    avatar: "/placeholder.svg",
    initials: "BS",
  },
  {
    id: 3,
    user: "Carol Wilson",
    action: "shared a document",
    time: "1 hour ago",
    avatar: "/placeholder.svg",
    initials: "CW",
  },
  {
    id: 4,
    user: "David Brown",
    action: "completed a task",
    time: "2 hours ago",
    avatar: "/placeholder.svg",
    initials: "DB",
  },
];

export const RecentActivity = () => {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.avatar} alt={activity.user} />
                <AvatarFallback className="text-xs">
                  {activity.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.user}{" "}
                  <span className="font-normal text-muted-foreground">
                    {activity.action}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};