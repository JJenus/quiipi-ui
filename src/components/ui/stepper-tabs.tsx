// components/ui/stepper-tabs.tsx
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  title: string;
  icon: React.ElementType;
  description?: string;
}

interface StepperTabsProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
  children: React.ReactNode[];
  className?: string;
}

export const StepperTabs: React.FC<StepperTabsProps> = ({
  steps,
  currentStep,
  onStepChange,
  children,
  className,
}) => {
  return (
    <div className={cn("w-full", className)}>
      {/* Stepper Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step Indicator */}
              <div className="flex flex-col items-center relative">
                <button
                  type="button"
                  onClick={() => index < currentStep && onStepChange(index)}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                    index < currentStep 
                      ? "bg-primary border-primary text-primary-foreground cursor-pointer" 
                      : index === currentStep
                      ? "border-primary text-primary"
                      : "border-muted-foreground/30 text-muted-foreground cursor-not-allowed"
                  )}
                  disabled={index > currentStep}
                >
                  {index < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </button>
                <span className="text-xs mt-2 hidden sm:block">{step.title}</span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-[2px] mx-2",
                  index < currentStep 
                    ? "bg-primary" 
                    : "bg-muted-foreground/30"
                )} />
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Step Description */}
        <div className="text-center mt-4">
          <h3 className="text-lg font-medium">{steps[currentStep].title}</h3>
          <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {children[currentStep]}
      </div>
    </div>
  );
};