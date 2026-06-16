import React from 'react';

interface Step {
  num: number;
  label: string;
}

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="stepper-container">
      <div 
        className="step-line" 
        style={{
          left: '12%',
          right: '12%',
          top: '40px',
          background: `linear-gradient(to right, #2563eb ${((currentStep - 1) / (steps.length - 1)) * 100}%, #e2e8f0 ${((currentStep - 1) / (steps.length - 1)) * 100}%)`
        }}
      />
      {steps.map((s) => {
        let stepClass = 'pending';
        if (s.num === currentStep) {
          stepClass = 'active';
        } else if (s.num < currentStep) {
          stepClass = 'completed';
        }

        return (
          <div key={s.num} className={`stepper-item ${stepClass}`}>
            <div className="step-circle">
              {s.num < currentStep ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                s.num
              )}
            </div>
            <span className="step-label">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
};
