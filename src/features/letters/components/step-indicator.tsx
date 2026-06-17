import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
  num: number;
  label: string;
}

interface StepIndicatorProps {
  currentStep: number;
  highestStep: number;
  steps: Step[];
  onStepClick?: (stepNum: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, highestStep, steps, onStepClick }) => {
  return (
    <div className="relative flex items-center justify-between rounded-xl border border-border bg-card px-10 py-6 shadow-sm">
      {/* Progress line */}
      <div
        className="absolute h-0.5 z-[1]"
        style={{
          left: '12%',
          right: '12%',
          top: '40px',
          background: `linear-gradient(to right, hsl(var(--primary)) ${((currentStep - 1) / (steps.length - 1)) * 100}%, hsl(var(--border)) ${((currentStep - 1) / (steps.length - 1)) * 100}%)`,
        }}
      />

      {steps.map((s) => {
        const isActive = s.num === currentStep;
        // Checkmark should show if it was completed and we aren't currently on it, or if it's strictly less than highestStep?
        // Let's say it's "completed" visually if we've passed it (s.num < highestStep) AND it's not the active step.
        // Actually, if highestStep is 4 and we are on step 1, steps 2 and 3 should show checkmarks (completed).
        const isCompleted = s.num <= highestStep && s.num !== currentStep;
        const isClickable = s.num <= highestStep && s.num !== currentStep;

        return (
          <div 
            key={s.num} 
            className="relative z-[2] flex flex-1 flex-col items-center gap-2"
          >
            <div
              onClick={() => isClickable && onStepClick?.(s.num)}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300',
                isActive && 'bg-primary text-primary-foreground border-2 border-primary shadow-[0_0_0_4px_rgba(37,99,235,0.15)]',
                isCompleted && 'bg-blue-50 text-primary border-2 border-primary',
                isClickable && 'cursor-pointer hover:bg-blue-100 hover:scale-110',
                !isActive && !isCompleted && 'bg-white text-slate-400 border-2 border-slate-300',
              )}
            >
              {isCompleted ? (
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              ) : (
                s.num
              )}
            </div>
            <span
              className={cn(
                'text-xs font-medium transition-colors duration-300',
                isActive && 'text-primary font-semibold',
                isCompleted && 'text-foreground',
                !isActive && !isCompleted && 'text-slate-400',
              )}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
