import React from "react";
import { EmptyState } from "../../../shared/components/EmptyState";
import { Wrench } from "lucide-react";

interface SettingsEmptyStateProps {
  title: string;
  description: string;
}

export function SettingsEmptyState({ title, description }: SettingsEmptyStateProps) {
  return (
    <div className="py-12 bg-card rounded-2xl border border-border/50 shadow-sm glass-panel">
      <EmptyState
        icon={<Wrench className="h-10 w-10 text-muted-foreground/60" />}
        title={title}
        description={description}
      />
    </div>
  );
}
