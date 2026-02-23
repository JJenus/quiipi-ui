// components/ui/scrollable-dialog.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ScrollableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const ScrollableDialog: React.FC<ScrollableDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  contentClassName,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-[900px] p-0", className)}>
        <DialogHeader className="p-6 border-b">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <ScrollArea className={cn("max-h-[calc(90vh-120px)]", contentClassName)}>
          <div className="px-6 py-4">
            {children}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};