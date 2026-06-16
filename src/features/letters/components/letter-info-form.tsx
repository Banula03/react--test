import React, { useState, useEffect } from 'react';
import { step2Schema } from '../schemas/letter-schema';
import type { CreateLetterFormData } from '../schemas/letter-schema';
import { ZodError } from 'zod';

interface LetterInfoFormProps {
  formData: CreateLetterFormData;
  onChange: (data: CreateLetterFormData) => void;
  onNext: () => void;
}

export const LetterInfoForm: React.FC<LetterInfoFormProps> = ({
  formData,
  onChange,
  onNext,
}) => {
  const [errors, setErrors] = useState<Partial<Record<keyof CreateLetterFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CreateLetterFormData, boolean>>>({});

  useEffect(() => {
    validateForm(false);
  }, [formData]);

  const validateForm = (showAllErrors = false) => {
    try {
      step2Schema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof CreateLetterFormData, string>> = {};
        err.issues.forEach((issue) => {
          const path = issue.path[0] as keyof CreateLetterFormData;
          if (showAllErrors || touched[path]) {
            fieldErrors[path] = issue.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleBlur = (field: keyof CreateLetterFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    try {
      step2Schema.parse(formData);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (err) {
      if (err instanceof ZodError) {
        const matchingError = err.issues.find((issue) => issue.path[0] === field);
        if (matchingError) {
          setErrors((prev) => ({ ...prev, [field]: matchingError.message }));
        } else {
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
      }
    }
  };

  const handleChangeField = (field: keyof CreateLetterFormData, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  // Master "Full Details" toggles all three sub-checkboxes
  const handleFullDetailsChange = (checked: boolean) => {
    onChange({
      ...formData,
      fullDetails: checked,
      withOdLimit: checked,
      withLateFees: checked,
    });
  };

  // Individual sub-checkbox — if either is unchecked, master becomes unchecked
  const handleSubCheckboxChange = (
    field: 'withOdLimit' | 'withLateFees',
    checked: boolean
  ) => {
    const updated = { ...formData, [field]: checked };
    // Full Details is only true when ALL sub-checkboxes are ticked
    updated.fullDetails = !!(updated.withOdLimit && updated.withLateFees);
    onChange(updated);
  };

  const handleClear = () => {
    onChange({
      ...formData,
      br: '',
      fromDate: '',
      toDate: '',
      asAtDate: '',
      fullDetails: false,
      withOdLimit: false,
      withLateFees: false,
    });
    setErrors({});
    setTouched({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Force touch all fields for validation
    setTouched({
      br: true,
      fromDate: true,
      toDate: true,
      asAtDate: true,
    });

    const isValid = validateForm(true);
    if (isValid) {
      /*
       * TODO: BACKEND INTEGRATION - SEARCH AS-400 DB
       * This is where you will make your API call to your backend
       * to search the AS-400 database using the `formData.br` and date range.
       * 
       * Example:
       * fetch(`/api/customer/search?br=${formData.br}&from=${formData.fromDate}...`)
       *   .then(res => res.json())
       *   .then(data => {
       *     // Store the fetched customer & accounts data in state/context
       *     onNext(); // Move to the Data Display Screen (Step 3)
       *   });
       */
      onNext();
    }
  };

  const isFormValid = formData.br.trim() !== '';

  return (
    <div className="wizard-card animated-step" style={{ padding: '0 0 32px 0', overflow: 'hidden' }}>

      {/* Navy blue header banner */}
      <div className="search-screen-header">
        Search Screen
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '0 40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* BR Row */}
        <div className="search-row">
          <div className="search-label-box">BR</div>
          <div style={{ flex: 1 }}>
            <input
              id="br"
              type="text"
              className={`form-input ${errors.br ? 'error-border' : ''}`}
              style={{ maxWidth: '400px' }}
              value={formData.br}
              onChange={(e) => handleChangeField('br', e.target.value)}
              onBlur={() => handleBlur('br')}
              placeholder="Enter BR code"
            />
            {errors.br && (
              <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>
                {errors.br}
              </div>
            )}
          </div>
        </div>

        {/* Duration Row */}
        <div className="search-row" style={{ alignItems: 'flex-start' }}>
          <div className="search-label-box" style={{ marginTop: '24px' }}>Duration</div>
          <div className="search-input-group">
            <div className="date-input-container">
              <span className="date-input-label">From Date :</span>
              <input
                type="date"
                className={`form-input ${errors.fromDate ? 'error-border' : ''}`}
                value={formData.fromDate || ''}
                onChange={(e) => handleChangeField('fromDate', e.target.value)}
                onBlur={() => handleBlur('fromDate')}
                style={{ width: '220px' }}
              />
              {errors.fromDate && <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.fromDate}</div>}
            </div>
            <div className="date-input-container">
              <span className="date-input-label">To Date :</span>
              <input
                type="date"
                className={`form-input ${errors.toDate ? 'error-border' : ''}`}
                value={formData.toDate || ''}
                onChange={(e) => handleChangeField('toDate', e.target.value)}
                onBlur={() => handleBlur('toDate')}
                style={{ width: '220px' }}
              />
              {errors.toDate && <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.toDate}</div>}
            </div>
          </div>
        </div>

        {/* As at Date Row */}
        <div className="search-row" style={{ alignItems: 'flex-start' }}>
          <div className="search-label-box" style={{ marginTop: '24px' }}>As at Date</div>
          <div className="date-input-container">
            <input
              type="date"
              className={`form-input ${errors.asAtDate ? 'error-border' : ''}`}
              value={formData.asAtDate || ''}
              onChange={(e) => handleChangeField('asAtDate', e.target.value)}
              onBlur={() => handleBlur('asAtDate')}
              style={{ width: '220px', marginTop: '24px' }}
            />
            {errors.asAtDate && <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.asAtDate}</div>}
          </div>
        </div>

        {/* ─── Checkbox Group ─────────────────────────────────── */}
        <div className="checkbox-section">
          <div className="checkbox-section-title">Detail Options</div>

          <div className="checkbox-group">

            {/* Full Details — master checkbox */}
            <label className={`checkbox-card checkbox-master ${formData.fullDetails ? 'checked' : ''}`}>
              <div className="checkbox-card-indicator">
                <input
                  id="fullDetails"
                  type="checkbox"
                  checked={!!formData.fullDetails}
                  onChange={(e) => handleFullDetailsChange(e.target.checked)}
                />
                <div className="custom-check">
                  {formData.fullDetails && (
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>
              <div className="checkbox-card-label">
                <span className="checkbox-label-main">Full Details</span>
                <span className="checkbox-label-sub">Includes all options below</span>
              </div>
            </label>

            {/* Sub-checkboxes */}
            <div className="checkbox-sub-group">

              <label className={`checkbox-card checkbox-sub ${formData.withOdLimit ? 'checked' : ''}`}>
                <div className="checkbox-card-indicator">
                  <input
                    id="withOdLimit"
                    type="checkbox"
                    checked={!!formData.withOdLimit}
                    onChange={(e) => handleSubCheckboxChange('withOdLimit', e.target.checked)}
                  />
                  <div className="custom-check">
                    {formData.withOdLimit && (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
                <div className="checkbox-card-label">
                  <span className="checkbox-label-main">With OD Limit</span>
                  <span className="checkbox-label-sub">Include overdraft limit details</span>
                </div>
              </label>

              <label className={`checkbox-card checkbox-sub ${formData.withLateFees ? 'checked' : ''}`}>
                <div className="checkbox-card-indicator">
                  <input
                    id="withLateFees"
                    type="checkbox"
                    checked={!!formData.withLateFees}
                    onChange={(e) => handleSubCheckboxChange('withLateFees', e.target.checked)}
                  />
                  <div className="custom-check">
                    {formData.withLateFees && (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
                <div className="checkbox-card-label">
                  <span className="checkbox-label-main">With Late Fees</span>
                  <span className="checkbox-label-sub">Include any accrued late fees</span>
                </div>
              </label>

            </div>{/* end sub-group */}
          </div>{/* end checkbox-group */}
        </div>
        {/* ─── end Checkbox Group ──────────────────────────────── */}

        {/* Action buttons */}
        <div className="search-btn-group">
          <button
            type="submit"
            className="btn-search"
            disabled={!isFormValid}
            style={{ opacity: isFormValid ? 1 : 0.6, cursor: isFormValid ? 'pointer' : 'not-allowed' }}
          >
            Search
          </button>
          <button type="button" className="btn-search" onClick={handleClear}>
            Clear
          </button>
        </div>

      </form>
    </div>
  );
};
