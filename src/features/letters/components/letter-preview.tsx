import React, { useState, useEffect } from 'react';
import { createLetterSchema } from '../schemas/letter-schema';
import type { CreateLetterFormData } from '../schemas/letter-schema';
import { ZodError } from 'zod';

interface LetterPreviewProps {
  letterType: 'with-facility' | 'without-facility';
  formData: CreateLetterFormData;
  onChange: (data: CreateLetterFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

const ACCOUNT_OPTIONS = [
  { value: '10010001000100', label: '10010001000100', balance: 'Rs. 1,254,320.00' },
  { value: '10010001000101', label: '10010001000101', balance: 'Rs. 98,450.00' },
  { value: '10010001000102', label: '10010001000102', balance: 'Rs. 3,760,890.00' },
];

const REVIEWING_OFFICERS = [
  { value: '', label: '-- Select Officer --' },
  { value: 'officer1', label: 'Mr. K. Rajapaksha – Senior Manager' },
  { value: 'officer2', label: 'Ms. P. Fernando – Branch Manager' },
  { value: 'officer3', label: 'Mr. S. Wickramasinghe – Operations Head' },
];

/* ─── Letter Preview Modal ──────────────────────────── */
interface PreviewModalProps {
  onClose: () => void;
  /** TODO: Pass the Jasper report URL here once backend is connected */
  jasperUrl?: string;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  onClose,
  jasperUrl,
}) => {
  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div
        className="preview-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="preview-modal-header">
          <span>Letter Preview</span>
          <button className="preview-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="preview-modal-body">
          {jasperUrl ? (
            /* Once backend is connected, render Jasper report in an iframe */
            <iframe
              src={jasperUrl}
              title="Jasper Report Preview"
              style={{ width: '100%', height: '100%', border: 'none', minHeight: '600px' }}
            />
          ) : (
            /* Loading state — waiting for Jasper report URL */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 40px',
              minHeight: '400px',
              gap: '24px',
            }}>
              {/* Spinner */}
              <div className="preview-spinner" />

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: '#334155',
                  marginBottom: '8px',
                }}>
                  Generating Letter Preview…
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  color: '#94a3b8',
                  maxWidth: '340px',
                  lineHeight: 1.5,
                }}>
                  Connecting to the report server. The Jasper report will render here once the backend is integrated.
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="preview-modal-footer">
          <button className="btn-secondary" onClick={onClose}>Close</button>
          <button className="btn-primary" disabled={!jasperUrl}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Data Entering Screen ─────────────────────── */
export const LetterPreview: React.FC<LetterPreviewProps> = ({
  letterType: _letterType,
  formData,
  onChange,
  onNext,
  onBack,
}) => {
  const [errors, setErrors] = useState<Partial<Record<keyof CreateLetterFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CreateLetterFormData, boolean>>>({});
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    validateForm(false);
  }, [formData]);

  const validateForm = (showAllErrors = false) => {
    try {
      createLetterSchema.parse(formData);
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
      createLetterSchema.parse(formData);
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

  const handleChangeField = (field: keyof CreateLetterFormData, value: any) => {
    onChange({ ...formData, [field]: value });
  };

  const handleAction = (action: 'submit' | 'preview') => {
    // Force touch all fields on this screen before validating
    setTouched((prev) => ({
      ...prev,
      chargeAccount: true,
      charges: true,
      customerName: true,
      customerAddress: true,
      recipients: true,
      reviewingOfficer: true,
    }));

    const isValid = validateForm(true);
    if (isValid) {
      if (action === 'submit') {
        onNext();
      } else {
        setShowPreview(true);
      }
    }
  };

  const currentBalance =
    ACCOUNT_OPTIONS.find((a) => a.value === formData.chargeAccount)?.balance ?? '';

  return (
    <>
      {showPreview && (
        <PreviewModal
          onClose={() => setShowPreview(false)}
        />
      )}

      <div className="wizard-card animated-step" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="dds-header">Data Entering Screen</div>

        <div style={{ padding: '28px 40px 32px' }}>

          {/* ══ Customer Charges Credit ══ */}
          <div className="des-section">
            <div className="des-section-title">Customer Charges Credit</div>
            <div className="des-radio-row">
              {(
                [
                  ['debit', 'Debit from Selected Account'],
                  ['not-applicable', 'Not Applicable'],
                  ['manual', 'To Be Collected Manually'],
                ] as const
              ).map(([val, label]) => (
                <label key={val} className="des-radio-label">
                  <input
                    type="radio"
                    name="chargesMode"
                    value={val}
                    checked={formData.chargesMode === val}
                    onChange={() => handleChangeField('chargesMode', val)}
                    className="des-radio"
                  />
                  {label}
                </label>
              ))}
            </div>

            <div className="des-field-grid">
              <div className="des-field-row">
                <span className="des-field-label">Account Numbers</span>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <select
                    className={`des-select ${errors.chargeAccount ? 'error-border' : ''}`}
                    value={formData.chargeAccount || ''}
                    onChange={(e) => handleChangeField('chargeAccount', e.target.value)}
                    onBlur={() => handleBlur('chargeAccount')}
                    disabled={formData.chargesMode !== 'debit'}
                  >
                    {ACCOUNT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {formData.chargesMode === 'debit' && (
                    <span className="des-balance-badge">
                      Available Balance: {currentBalance}
                    </span>
                  )}
                  {errors.chargeAccount && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginLeft: '8px' }}>{errors.chargeAccount}</span>}
                </div>
              </div>

              <div className="des-field-row">
                <span className="des-field-label">Charges</span>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    className={`des-input ${errors.charges ? 'error-border' : ''}`}
                    style={{ width: '160px', flex: 'none' }}
                    value={formData.charges || ''}
                    onChange={(e) => handleChangeField('charges', e.target.value)}
                    onBlur={() => handleBlur('charges')}
                    disabled={formData.chargesMode === 'not-applicable'}
                  />
                  {errors.charges && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginLeft: '8px' }}>{errors.charges}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* ══ Receipt Details ══ */}
          <div className="des-section">
            <div className="des-section-title">Receipt Details</div>
            <div className="des-radio-row">
              {(
                [
                  ['customer', 'Customer'],
                  ['manual', 'Manual'],
                  ['from-list', 'From List'],
                ] as const
              ).map(([val, label]) => (
                <label key={val} className="des-radio-label">
                  <input
                    type="radio"
                    name="receiptMode"
                    value={val}
                    checked={formData.receiptMode === val}
                    onChange={() => handleChangeField('receiptMode', val)}
                    className="des-radio"
                  />
                  {label}
                </label>
              ))}
            </div>

            <div className="des-field-grid">
              <div className="des-field-row">
                <span className="des-field-label">Customer Name</span>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    className={`des-input ${errors.customerName ? 'error-border' : ''}`}
                    value={formData.customerName || ''}
                    onChange={(e) => handleChangeField('customerName', e.target.value)}
                    onBlur={() => handleBlur('customerName')}
                  />
                  {errors.customerName && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginLeft: '8px' }}>{errors.customerName}</span>}
                </div>
              </div>
              <div className="des-field-row">
                <span className="des-field-label">Customer Address</span>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    className={`des-input ${errors.customerAddress ? 'error-border' : ''}`}
                    value={formData.customerAddress || ''}
                    onChange={(e) => handleChangeField('customerAddress', e.target.value)}
                    onBlur={() => handleBlur('customerAddress')}
                  />
                  {errors.customerAddress && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginLeft: '8px' }}>{errors.customerAddress}</span>}
                </div>
              </div>
              <div className="des-field-row">
                <span className="des-field-label">Recipients</span>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    className={`des-input ${errors.recipients ? 'error-border' : ''}`}
                    value={formData.recipients || ''}
                    onChange={(e) => handleChangeField('recipients', e.target.value)}
                    onBlur={() => handleBlur('recipients')}
                  />
                  {errors.recipients && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginLeft: '8px' }}>{errors.recipients}</span>}
                </div>
              </div>
              <div className="des-field-row">
                <span className="des-field-label">Additional Text</span>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="des-input"
                    value={formData.additionalText || ''}
                    onChange={(e) => handleChangeField('additionalText', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ══ Approval Details ══ */}
          <div className="des-section">
            <div className="des-section-title">Approval Details</div>
            <div className="des-field-grid">
              <div className="des-field-row">
                <span className="des-field-label">Reviewing Officer</span>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <select
                    className={`des-select ${errors.reviewingOfficer ? 'error-border' : ''}`}
                    value={formData.reviewingOfficer || ''}
                    onChange={(e) => handleChangeField('reviewingOfficer', e.target.value)}
                    onBlur={() => handleBlur('reviewingOfficer')}
                  >
                    {REVIEWING_OFFICERS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {errors.reviewingOfficer && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginLeft: '8px' }}>{errors.reviewingOfficer}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* ══ Action Buttons ══ */}
          <div className="des-btn-row">
            <button className="des-btn des-btn-default" type="button" onClick={onBack}>
              Previous
            </button>
            <button
              className="des-btn des-btn-default"
              type="button"
              onClick={() => handleAction('submit')}
            >
              Submit
            </button>
            <button
              className="des-btn des-btn-preview"
              type="button"
              onClick={() => handleAction('preview')}
            >
              Preview
            </button>
          </div>

        </div>
      </div>
    </>
  );
};
