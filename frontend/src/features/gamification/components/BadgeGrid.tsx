import React, { useState } from "react";
import { useBadgesQuery, useDeleteBadgeMutation } from "../hooks";
import { BadgeRecord } from "../schema";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { Badge } from "../../../shared/components/ui/badge";
import { Button } from "../../../shared/components/ui/button";
import { Skeleton } from "../../../shared/components/ui/skeleton";
import { Lock, Star, Trash2, Zap } from "lucide-react";
import { cn } from "../../../shared/lib/utils";

// Icon map for badge icon names
const ICON_FALLBACK = <Star className="w-8 h-8" />;
const iconMap: Record<string, React.ReactNode> = {
  "star.png": <Star className="w-8 h-8" />,
  "zap.png": <Zap className="w-8 h-8" />,
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
  const [newlyEarned, setNewlyEarned] = useState<Set<string>>(new Set());

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
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {badges.map((badge) => {
          const earned = userTotalPoints >= badge.points_value;
          const isNew = newlyEarned.has(badge.id);

          return (
            <div
              key={badge.id}
              className={cn(
                "group relative rounded-2xl border p-4 flex flex-col items-center gap-3 text-center transition-all duration-300 cursor-default",
                earned
                  ? [
                      "border-primary/30 bg-gradient-to-b from-primary/5 to-primary/10",
                      "hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1",
                      isNew && "animate-pulse ring-2 ring-primary ring-offset-2",
                    ]
                  : "border-border bg-muted/30 grayscale opacity-60 hover:opacity-80"
              )}
            >
              {/* Earned indicator ribbon */}
              {earned && (
                <span className="absolute top-2 right-2">
                  <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4">
                    Earned
                  </Badge>
                </span>
              )}
              {!earned && (
                <span className="absolute top-2 right-2">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                </span>
              )}

              {/* Icon */}
              <div
                className={cn(
                  "rounded-full p-3 transition-transform duration-300",
                  earned
                    ? "bg-primary/10 text-primary group-hover:scale-110"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {resolveBadgeIcon(badge.icon)}
              </div>

              {/* Name */}
              <p className="font-semibold text-sm leading-tight line-clamp-2">{badge.name}</p>

              {/* Points threshold */}
              <p className="text-xs text-muted-foreground">
                {badge.points_value.toLocaleString()} pts required
              </p>

              {/* Progress toward badge */}
              {!earned && (
                <div className="w-full">
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary/40 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((userTotalPoints / Math.max(badge.points_value, 1)) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {userTotalPoints} / {badge.points_value} pts
                  </p>
                </div>
              )}

              {/* Admin delete */}
              {!isReadOnly && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 w-full mt-1"
                  onClick={() => deleteMutation.mutate(badge.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
