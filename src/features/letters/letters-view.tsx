import React from 'react';
import { useLetters } from './hooks/use-letters';
import { StepIndicator } from './components/step-indicator';
import { LetterTypeSelector } from './components/letter-type-selector';
import { LetterInfoForm } from './components/letter-info-form';
import { AccountsSelection } from './components/accounts-selection';
import { LetterPreview } from './components/letter-preview';
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
    letterType,
    formData,
    selectedAccounts,
    handleSelectType,
    handleUpdateFormData,
    handleToggleAccount,
    handleNext,
    handleBack,
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
    <div className="wizard-page">
      <div className="wizard-container">
        
        {/* Back Link */}
        <a 
          href="#" 
          className="back-button"
          onClick={(e) => {
            e.preventDefault();
            if (currentStep > 1 && currentStep < 5) {
              handleBack();
            }
          }}
          style={{ visibility: currentStep === 1 || currentStep === 5 ? 'hidden' : 'visible' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Previous Step
        </a>

        {/* Header */}
        {currentStep < 5 && (
          <div className="wizard-header">
            <h1 className="wizard-title">Create Letter</h1>
            <p className="wizard-description">Follow the steps to create and submit a new corporate letter</p>
          </div>
        )}

        {/* Stepper */}
        {currentStep < 5 && (
          <StepIndicator currentStep={currentStep} steps={steps} />
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
            formData={formData}
            onChange={handleUpdateFormData}
            onNext={handleNext}
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
          <div className="wizard-card animated-step" style={{ textAlign: 'center', padding: '60px 40px' }}>
            <div style={{ 
              width: '72px', 
              height: '72px', 
              borderRadius: '50%', 
              backgroundColor: '#ecfdf5', 
              color: '#10b981', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 24px',
              border: '2px solid #a7f3d0'
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="wizard-card-title" style={{ fontSize: '1.6rem' }}>Letter Created Successfully!</h2>
            <p className="wizard-card-subtitle" style={{ maxWidth: '400px', margin: '8px auto 32px' }}>
              The corporate letter under reference branch <strong>"{formData.br}"</strong> has been generated and queued for approval.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button className="btn-primary" onClick={resetWizard}>
                Create Another Letter
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
