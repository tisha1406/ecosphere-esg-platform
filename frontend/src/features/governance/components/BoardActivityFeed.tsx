import React, { useState } from "react";
import { useBoardActivityQuery, useDeleteBoardActivityMutation } from "../hooks";
import { Skeleton } from "../../../shared/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shared/components/ui/avatar";
import { Button } from "../../../shared/components/ui/button";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";

export function BoardActivityFeed({ isReadOnly }: { isReadOnly: boolean }) {
  const { data, isLoading, isError } = useBoardActivityQuery();
  const deleteMutation = useDeleteBoardActivityMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-24 w-full rounded-xl" /><Skeleton className="h-24 w-full rounded-xl" /></div>;
  if (isError) return <div className="text-destructive p-4 border border-destructive/20 rounded-lg bg-destructive/5">Failed to load board activity.</div>;

  const activities = data?.data?.items || [];

  if (activities.length === 0) {
    return <div className="text-center p-8 text-muted-foreground bg-card/50 rounded-lg border border-border/50 border-dashed">No board activities recorded yet.</div>;
  }

  // Sort by meeting_date descending
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.meeting_date).getTime() - new Date(a.meeting_date).getTime()
  );

  return (
    <div className="relative border-l-2 border-governance/30 ml-3 space-y-8 py-2">
      {sortedActivities.map((activity: any) => (
        <div key={activity.id} className="relative pl-6">
          <div className="absolute w-3.5 h-3.5 bg-governance rounded-full -left-[8.5px] top-1.5 shadow-[0_0_0_4px_rgba(var(--background),1)]" />
          <div className="group bg-card p-5 rounded-xl border border-border/50 shadow-sm glass-card hover:border-governance/30 transition-all duration-300 flex flex-col sm:flex-row gap-4 justify-between items-start">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <h4 className="text-base font-semibold text-foreground">{activity.topic}</h4>
                <span className="text-xs font-medium text-governance bg-governance/10 px-2 py-0.5 rounded-full">
                  {activity.meeting_date}
                </span>
              </div>
              <p className="text-sm text-muted-foreground/90 leading-relaxed">{activity.decision}</p>
              
              {activity.attendees && activity.attendees.length > 0 && (
                <div className="flex -space-x-2 pt-3 overflow-hidden">
                  {activity.attendees.map((attendee: any) => (
                    <Avatar key={attendee.id} className="inline-block border-2 border-card h-8 w-8 hover:z-10 hover:scale-110 transition-transform">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${attendee.full_name}`} alt={attendee.full_name} />
                      <AvatarFallback>{attendee.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              )}
            </div>
            {!isReadOnly && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0 -mt-1 -mr-1"
                onClick={() => setDeleteId(activity.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
      <ConfirmDialog
        isOpen={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteMutation.mutate(deleteId, {
              onSuccess: () => setDeleteId(null)
            });
          }
        }}
        title="Delete Board Activity"
        description="Are you sure you want to delete this board activity record? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
