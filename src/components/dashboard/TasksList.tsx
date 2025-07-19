import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const tasks = [
  {
    id: 1,
    title: "Review project proposal",
    completed: false,
    priority: "high",
    dueDate: "Today",
  },
  {
    id: 2,
    title: "Update team documentation",
    completed: true,
    priority: "medium",
    dueDate: "Yesterday",
  },
  {
    id: 3,
    title: "Schedule client meeting",
    completed: false,
    priority: "high",
    dueDate: "Tomorrow",
  },
  {
    id: 4,
    title: "Backup database",
    completed: false,
    priority: "low",
    dueDate: "Next week",
  },
];

const priorityColors = {
  high: "destructive",
  medium: "secondary",
  low: "outline",
} as const;

export const TasksList = () => {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Today's Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <Checkbox
                checked={task.completed}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <div className="flex-1 space-y-1">
                <p
                  className={`text-sm font-medium ${
                    task.completed
                      ? "line-through text-muted-foreground"
                      : ""
                  }`}
                >
                  {task.title}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant={priorityColors[task.priority]} className="text-xs">
                    {task.priority}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {task.dueDate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};