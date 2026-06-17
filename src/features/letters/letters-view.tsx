import React from 'react';
import { useLetters } from './hooks/use-letters';
import { StepIndicator } from './components/step-indicator';
import { LetterTypeSelector } from './components/letter-type-selector';
import { LetterInfoForm } from './components/letter-info-form';
import { AccountsSelection } from './components/accounts-selection';
import { LetterPreview } from './components/letter-preview';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
/*
 * FILE: letters-view.tsx
 * PURPOSE: This is the main "Container" or "Orchestrator" component for the entire Letter Creation Wizard.
 * WHAT HAPPENS HERE: It maintains the current step, holds the shared form data (via useLetters hook), and handles the Next/Back navigation between the 5 steps.
 * WHAT YOU SHOULD DO HERE: 
 *   - If you need to load initial configuration data when the page opens, you can add a useEffect here to call your backend API.
 *   - The actual submission of data happens through the `submitLetter` function provided by the `use-letters.ts` hook.
 */

export const LettersView: React.FC = () => {
  const {
    currentStep,
    highestStep,
    letterType,
    formData,
    selectedAccounts,
    handleSelectType,
    handleUpdateFormData,
    handleToggleAccount,
    handleNext,
    handleBack,
    jumpToStep,
    submitLetter,
    resetWizard,
  } = useLetters();

  const steps = [
    { num: 1, label: 'Select Type' },
    { num: 2, label: 'Details' },
    { num: 3, label: 'Accounts' },
    { num: 4, label: 'Preview' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-6 py-10 flex justify-center">
      <div className="w-full max-w-[1040px] flex flex-col gap-6">
        
        {/* Header */}
        {currentStep < 5 && (
          <div className="mb-2">
            <h1 className="text-[1.75rem] font-bold text-slate-900 tracking-tight mb-1.5">Create Letter</h1>
            <p className="text-[0.925rem] text-slate-500">Follow the steps to create and submit a new corporate letter</p>
          </div>
        )}

        {/* Stepper */}
        {currentStep < 5 && (
          <StepIndicator currentStep={currentStep} highestStep={highestStep} steps={steps} onStepClick={jumpToStep} />
        )}

        {/* Step Content routing */}
        {currentStep === 1 && (
          <LetterTypeSelector
            letterType={letterType}
            onSelect={handleSelectType}
            onNext={handleNext}
            isValid={letterType !== null}
          />
        )}

        {currentStep === 2 && (
          <LetterInfoForm
            letterType={letterType}
            formData={formData}
            onChange={handleUpdateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 3 && (
          <AccountsSelection
            letterType={letterType || 'without-facility'}
            selectedAccounts={selectedAccounts}
            onToggleAccount={handleToggleAccount}
            onNext={handleNext}
            onBack={handleBack}
            isValid={selectedAccounts.length > 0}
          />
        )}

        {currentStep === 4 && (
          <LetterPreview
            letterType={letterType || 'without-facility'}
            formData={formData}
            onChange={handleUpdateFormData}
            onNext={submitLetter}
            onBack={handleBack}
          />
        )}

        {/* Step 5: Success screen */}
        {currentStep === 5 && (
          <Card className="animated-step border-none shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-[60px] px-10 text-center">
              <div className="w-[72px] h-[72px] rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 border-2 border-emerald-200">
                <CheckCircle2 className="w-9 h-9" strokeWidth={2.5} />
              </div>
              <CardTitle className="text-[1.6rem] mb-2 text-slate-900">Letter Created Successfully!</CardTitle>
              <CardDescription className="max-w-[400px] mb-8 text-base">
                The corporate letter under reference branch <strong className="text-slate-700 font-semibold">"{formData.br}"</strong> has been generated and queued for approval.
              </CardDescription>
              <div className="flex justify-center gap-3">
                <Button onClick={resetWizard}>
                  Create Another Letter
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
};
