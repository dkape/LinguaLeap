import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Users } from "lucide-react";
  
  export default function StudentGroupsPage() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Student Groups</h1>
          <p className="text-muted-foreground">
            Manage your student groups and track their progress.
          </p>
        </div>
  
        <Card>
          <CardHeader>
            <CardTitle>My Groups</CardTitle>
            <CardDescription>
              Here are the student groups you have created.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
                <Users className="w-12 h-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-muted-foreground">
                    No groups yet
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Create a new group to get started.
                </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  