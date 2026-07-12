import React, { useState } from "react";
import { useBadgesQuery, useDeleteBadgeMutation } from "../hooks";
import { BadgeRecord } from "../schema";
import { Badge } from "../../../shared/components/ui/badge";
import { Button } from "../../../shared/components/ui/button";
import { Skeleton } from "../../../shared/components/ui/skeleton";
import { Lock, Star, Trash2, Zap, Shield, Leaf, Heart } from "lucide-react";
import { cn } from "../../../shared/lib/utils";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../shared/components/ui/tooltip";

// Icon map for badge icon names
const ICON_FALLBACK = <Star className="w-8 h-8" />;
const iconMap: Record<string, React.ReactNode> = {
  "star.png": <Star className="w-8 h-8" />,
  "zap.png": <Zap className="w-8 h-8" />,
  "shield.png": <Shield className="w-8 h-8" />,
  "leaf.png": <Leaf className="w-8 h-8" />,
  "heart.png": <Heart className="w-8 h-8" />,
};

function resolveBadgeIcon(icon: string): React.ReactNode {
  return iconMap[icon] ?? ICON_FALLBACK;
}

interface BadgeGridProps {
  userTotalPoints?: number;
  isReadOnly?: boolean;
}

export function BadgeGrid({ userTotalPoints = 0, isReadOnly = true }: BadgeGridProps) {
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const { data, isLoading } = useBadgesQuery({ page, page_size: pageSize });
  const deleteMutation = useDeleteBadgeMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const badges: BadgeRecord[] = data?.data?.items || [];
  const total: number = data?.data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-card/50 rounded-lg border border-border/50 border-dashed">
        <Star className="w-12 h-12 mb-4 opacity-30" />
        <p className="text-lg font-medium">No badges defined yet</p>
        {!isReadOnly && (
          <p className="text-sm">Create your first badge to get started.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TooltipProvider>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {badges.map((badge) => {
            const earned = userTotalPoints >= badge.points_value;

            return (
              <Tooltip key={badge.id} delayDuration={300}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "group relative rounded-2xl border p-4 flex flex-col items-center gap-3 text-center transition-all duration-500 cursor-default glass-card overflow-hidden",
                      earned
                        ? "border-orange-500/40 bg-gradient-to-b from-orange-500/10 to-orange-500/5 hover:shadow-[0_0_15px_rgba(249,115,22,0.15)] hover:-translate-y-1"
                        : "border-border/50 bg-muted/20 grayscale-[0.85] opacity-75 hover:grayscale-[0.5] hover:opacity-100"
                    )}
                  >
                    {/* Animated shine effect on hover if earned */}
                    {earned && (
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_ease-in-out_infinite]" />
                    )}

                    {/* Earned indicator ribbon */}
                    {earned && (
                      <span className="absolute top-2 right-2 z-10">
                        <Badge variant="default" className="text-[10px] px-2 py-0.5 h-5 bg-orange-500 hover:bg-orange-600 shadow-sm">
                          Unlocked
                        </Badge>
                      </span>
                    )}
                    {!earned && (
                      <span className="absolute top-3 right-3 z-10">
                        <Lock className="w-4 h-4 text-muted-foreground/70" />
                      </span>
                    )}

                    {/* Icon */}
                    <div
                      className={cn(
                        "rounded-full p-4 transition-transform duration-500 ease-out z-10 relative",
                        earned
                          ? "bg-orange-500/15 text-orange-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {resolveBadgeIcon(badge.icon)}
                    </div>

                    {/* Name */}
                    <p className={cn("font-bold text-sm leading-tight line-clamp-2 z-10", earned ? "text-foreground" : "text-muted-foreground")}>
                      {badge.name}
                    </p>

                    {/* Points threshold */}
                    <p className="text-xs font-medium text-muted-foreground z-10">
                      {badge.points_value.toLocaleString()} pts
                    </p>

                    {/* Progress toward badge */}
                    {!earned && (
                      <div className="w-full z-10 mt-1">
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden shadow-inner">
                          <div
                            className="h-full bg-orange-500/50 rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round((userTotalPoints / Math.max(badge.points_value, 1)) * 100)
                              )}%`,
                            }}
                          />
                        </div>
                        <p className="text-[10px] font-medium text-muted-foreground mt-1.5">
                          {userTotalPoints.toLocaleString()} / {badge.points_value.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {/* Admin delete */}
                    {!isReadOnly && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 w-full mt-2 z-10 h-8"
                        onClick={() => setDeleteId(badge.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px] text-center glass-card border-orange-500/20">
                  <p className="text-sm font-semibold mb-1 text-orange-500">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.criteria}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm font-medium text-muted-foreground px-4">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}

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
        title="Delete Badge"
        description="Are you sure you want to delete this badge? Users who have earned it will lose it."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
