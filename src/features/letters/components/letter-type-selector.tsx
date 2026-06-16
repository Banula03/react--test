import React from 'react';

interface LetterTypeSelectorProps {
  letterType: 'with-facility' | 'without-facility' | null;
  onSelect: (type: 'with-facility' | 'without-facility') => void;
  onNext: () => void;
  isValid: boolean;
}

export const LetterTypeSelector: React.FC<LetterTypeSelectorProps> = ({
  letterType,
  onSelect,
  onNext,
  isValid,
}) => {
  return (
    <div className="wizard-card animated-step">
      <div className="wizard-card-header">
        <h2 className="wizard-card-title">Choose Letter Type</h2>
        <p className="wizard-card-subtitle">Select the type of letter you want to create</p>
      </div>

      <div className="cards-grid">
        {/* Option 1: With Facility Breakdown */}
        <div 
          className={`option-card ${letterType === 'with-facility' ? 'selected' : ''}`}
          onClick={() => onSelect('with-facility')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onSelect('with-facility')}
        >
          <div className="option-card-header">
            <div className="icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M3 15h18" />
                <path d="M9 9v13" />
                <path d="M15 9v13" />
              </svg>
            </div>
            <span className="card-badge badge-comprehensive">comprehensive</span>
          </div>
          <div className="option-card-body">
            <h3 className="option-title">With Facility Breakdown</h3>
            <p className="option-description">
              Include a detailed breakdown of deposit accounts, leasing facilities, and trading facilities associated with the customer.
            </p>
          </div>
        </div>

        {/* Option 2: Without Facility Breakdown */}
        <div 
          className={`option-card ${letterType === 'without-facility' ? 'selected' : ''}`}
          onClick={() => onSelect('without-facility')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onSelect('without-facility')}
        >
          <div className="option-card-header">
            <div className="icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="17" x2="16" y2="17" />
              </svg>
            </div>
            <span className="card-badge badge-standard">standard</span>
          </div>
          <div className="option-card-body">
            <h3 className="option-title">Without Facility Breakdown</h3>
            <p className="option-description">
              Create a standard letter without the facility breakdown tables. Suitable for general correspondence.
            </p>
          </div>
        </div>
      </div>

      <div className="wizard-actions">
        <button 
          className="btn-primary" 
          disabled={!isValid}
          onClick={onNext}
        >
          Next Step
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
};
