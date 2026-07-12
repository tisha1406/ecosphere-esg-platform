import React from "react";
import { useBoardActivityQuery, useDeleteBoardActivityMutation } from "../hooks";
import { Skeleton } from "../../../shared/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shared/components/ui/avatar";
import { Button } from "../../../shared/components/ui/button";
import { Trash2 } from "lucide-react";

export function BoardActivityFeed({ isReadOnly }: { isReadOnly: boolean }) {
  const { data, isLoading, isError } = useBoardActivityQuery();
  const deleteMutation = useDeleteBoardActivityMutation();

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div>;
  if (isError) return <div className="text-red-500">Failed to load board activity.</div>;

  const activities = data?.data?.items || [];

  if (activities.length === 0) {
    return <div className="text-center p-8 text-muted-foreground">No board activities recorded yet.</div>;
  }

  return (
    <div className="relative border-l border-muted ml-3 space-y-8">
      {activities.map((activity: any) => (
        <div key={activity.id} className="relative pl-6">
          <div className="absolute w-3 h-3 bg-governance rounded-full -left-[6.5px] top-1.5" style={{ backgroundColor: "hsl(var(--governance))" }}></div>
          <div className="bg-card p-4 rounded-lg border shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold">{activity.topic}</h4>
                <span className="text-xs text-muted-foreground">{activity.meeting_date}</span>
              </div>
              <p className="text-sm text-muted-foreground">{activity.decision}</p>
              
              {activity.attendees && activity.attendees.length > 0 && (
                <div className="flex -space-x-2 pt-2 overflow-hidden">
                  {activity.attendees.map((attendee: any) => (
                    <Avatar key={attendee.id} className="inline-block border-2 border-background h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${attendee.full_name}`} alt={attendee.full_name} />
                      <AvatarFallback>{attendee.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              )}
            </div>
            {!isReadOnly && (
              <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(activity.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
