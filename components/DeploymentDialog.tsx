import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { DeploymentPanel } from './DeploymentPanel';
import { MockApiEndpoint } from '../types/schema';
import { Rocket } from 'lucide-react';

interface DeploymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schema: any;
  mockApi: MockApiEndpoint[];
}

export function DeploymentDialog({ open, onOpenChange, schema, mockApi }: DeploymentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-card border-border rounded-[var(--radius-card)] p-0">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[var(--radius-card)] bg-primary flex items-center justify-center">
              <Rocket className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-foreground" style={{ fontSize: '15px' }}>Deploy Your Form</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1" style={{ fontSize: '12px' }}>
                Publish and embed your form anywhere
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="overflow-y-auto p-6 pt-4" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          <DeploymentPanel schema={schema} mockApi={mockApi} />
        </div>
      </DialogContent>
    </Dialog>
  );
}