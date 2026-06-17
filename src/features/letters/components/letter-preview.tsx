import React, { useState, useEffect } from 'react';
import { createLetterSchema } from '../schemas/letter-schema';
import type { CreateLetterFormData } from '../schemas/letter-schema';
import { ZodError } from 'zod';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Printer } from 'lucide-react';

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
  { value: 'officer1', label: 'Mr. K. Rajapaksha – Senior Manager' },
  { value: 'officer2', label: 'Ms. P. Fernando – Branch Manager' },
  { value: 'officer3', label: 'Mr. S. Wickramasinghe – Operations Head' },
];

/* ─── Letter Preview Modal ──────────────────────────── */
interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** TODO: Pass the Jasper report URL here once backend is connected */
  jasperUrl?: string;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  jasperUrl,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[720px] max-h-[90vh] p-0 overflow-hidden flex flex-col gap-0 border-none shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-[#2b3b7e] to-[#4a5da6] p-4 text-white">
          <DialogTitle className="text-white">Letter Preview</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-7 px-8 bg-slate-50 min-h-[400px] flex flex-col items-center justify-center">
          {jasperUrl ? (
            /* Once backend is connected, render Jasper report in an iframe */
            <iframe
              src={jasperUrl}
              title="Jasper Report Preview"
              className="w-full h-full border-none min-h-[600px]"
            />
          ) : (
            /* Loading state — waiting for Jasper report URL */
            <div className="flex flex-col items-center justify-center py-20 px-10 min-h-[400px] gap-6">
              {/* Spinner */}
              <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-[spin_0.8s_linear_infinite]" />

              <div className="text-center">
                <div className="text-[1.1rem] font-semibold text-slate-700 mb-2">
                  Generating Letter Preview…
                </div>
                <div className="text-[0.85rem] text-slate-400 max-w-[340px] leading-relaxed">
                  Connecting to the report server. The Jasper report will render here once the backend is integrated.
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="bg-white p-3.5 px-6 border-t border-slate-200 sm:justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button disabled={!jasperUrl}>
            <Printer className="mr-2 h-4 w-4" />
            Print / Save PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />

      <Card className="animated-step overflow-hidden p-0">
        <div className="bg-gradient-to-r from-[#2b3b7e] to-[#4a5da6] text-white py-3 px-6 text-xl font-semibold text-center">
          Data Entering Screen
        </div>

        <div className="p-7 px-10 pb-8">

          {/* ══ Customer Charges Credit ══ */}
          <div className="mb-7">
            <h3 className="text-[0.95rem] font-bold text-slate-900 mb-3">Customer Charges Credit</h3>
            
            <RadioGroup
              value={formData.chargesMode}
              onValueChange={(val: any) => handleChangeField('chargesMode', val)}
              className="flex items-center gap-7 mb-3.5"
            >
              {(
                [
                  ['debit', 'Debit from Selected Account'],
                  ['not-applicable', 'Not Applicable'],
                  ['manual', 'To Be Collected Manually'],
                ] as const
              ).map(([val, label]) => (
                <div key={val} className="flex items-center space-x-2">
                  <RadioGroupItem value={val} id={`charges-${val}`} className="border-slate-400 text-blue-900 data-[state=checked]:border-blue-900" />
                  <Label htmlFor={`charges-${val}`} className="text-[0.875rem] text-slate-700 font-normal cursor-pointer select-none">
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-0">
                <span className="min-w-[160px] py-[7px] px-3 bg-slate-100 border border-slate-300 border-r-0 text-[0.845rem] font-semibold text-slate-700 whitespace-nowrap">Account Numbers</span>
                <div className="flex-1 flex items-center">
                  <div className="w-[200px]">
                    <Select
                      value={formData.chargeAccount}
                      onValueChange={(val) => handleChangeField('chargeAccount', val)}
                      disabled={formData.chargesMode !== 'debit'}
                    >
                      <SelectTrigger 
                        error={!!errors.chargeAccount}
                        className={cn(
                          "h-[36px] text-[0.845rem] rounded-none rounded-r-md border-slate-300 shadow-none focus:ring-primary/20",
                          formData.chargesMode !== 'debit' && "bg-slate-50 text-slate-400"
                        )}
                        onBlur={() => handleBlur('chargeAccount')}
                      >
                        <SelectValue placeholder="Select Account" />
                      </SelectTrigger>
                      <SelectContent>
                        {ACCOUNT_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.chargesMode === 'debit' && (
                    <span className="ml-3.5 text-[0.845rem] font-semibold text-blue-900">
                      Available Balance: {currentBalance}
                    </span>
                  )}
                  {errors.chargeAccount && <span className="text-red-500 text-xs ml-2">{errors.chargeAccount}</span>}
                </div>
              </div>

              <div className="flex items-center gap-0">
                <span className="min-w-[160px] py-[7px] px-3 bg-slate-100 border border-slate-300 border-r-0 text-[0.845rem] font-semibold text-slate-700 whitespace-nowrap">Charges</span>
                <div className="flex-1 flex items-center">
                  <Input
                    type="text"
                    error={!!errors.charges}
                    className="w-[160px] h-[36px] text-[0.845rem] rounded-none rounded-r-md border-slate-300 shadow-none focus-visible:ring-primary/20 disabled:bg-slate-50 disabled:text-slate-400"
                    value={formData.charges || ''}
                    onChange={(e) => handleChangeField('charges', e.target.value)}
                    onBlur={() => handleBlur('charges')}
                    disabled={formData.chargesMode === 'not-applicable'}
                  />
                  {errors.charges && <span className="text-red-500 text-xs ml-2">{errors.charges}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* ══ Receipt Details ══ */}
          <div className="mb-7">
            <h3 className="text-[0.95rem] font-bold text-slate-900 mb-3">Receipt Details</h3>
            
            <RadioGroup
              value={formData.receiptMode}
              onValueChange={(val: any) => handleChangeField('receiptMode', val)}
              className="flex items-center gap-7 mb-3.5"
            >
              {(
                [
                  ['customer', 'Customer'],
                  ['manual', 'Manual'],
                  ['from-list', 'From List'],
                ] as const
              ).map(([val, label]) => (
                <div key={val} className="flex items-center space-x-2">
                  <RadioGroupItem value={val} id={`receipt-${val}`} className="border-slate-400 text-blue-900 data-[state=checked]:border-blue-900" />
                  <Label htmlFor={`receipt-${val}`} className="text-[0.875rem] text-slate-700 font-normal cursor-pointer select-none">
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-0">
                <span className="min-w-[160px] py-[7px] px-3 bg-slate-100 border border-slate-300 border-r-0 text-[0.845rem] font-semibold text-slate-700 whitespace-nowrap">Customer Name</span>
                <div className="flex-1 flex items-center">
                  <Input
                    type="text"
                    error={!!errors.customerName}
                    className="max-w-[320px] h-[36px] text-[0.845rem] rounded-none rounded-r-md border-slate-300 shadow-none focus-visible:ring-primary/20"
                    value={formData.customerName || ''}
                    onChange={(e) => handleChangeField('customerName', e.target.value)}
                    onBlur={() => handleBlur('customerName')}
                  />
                  {errors.customerName && <span className="text-red-500 text-xs ml-2">{errors.customerName}</span>}
                </div>
              </div>
              <div className="flex items-center gap-0">
                <span className="min-w-[160px] py-[7px] px-3 bg-slate-100 border border-slate-300 border-r-0 text-[0.845rem] font-semibold text-slate-700 whitespace-nowrap">Customer Address</span>
                <div className="flex-1 flex items-center">
                  <Input
                    type="text"
                    error={!!errors.customerAddress}
                    className="max-w-[320px] h-[36px] text-[0.845rem] rounded-none rounded-r-md border-slate-300 shadow-none focus-visible:ring-primary/20"
                    value={formData.customerAddress || ''}
                    onChange={(e) => handleChangeField('customerAddress', e.target.value)}
                    onBlur={() => handleBlur('customerAddress')}
                  />
                  {errors.customerAddress && <span className="text-red-500 text-xs ml-2">{errors.customerAddress}</span>}
                </div>
              </div>
              <div className="flex items-center gap-0">
                <span className="min-w-[160px] py-[7px] px-3 bg-slate-100 border border-slate-300 border-r-0 text-[0.845rem] font-semibold text-slate-700 whitespace-nowrap">Recipients</span>
                <div className="flex-1 flex items-center">
                  <Input
                    type="text"
                    error={!!errors.recipients}
                    className="max-w-[320px] h-[36px] text-[0.845rem] rounded-none rounded-r-md border-slate-300 shadow-none focus-visible:ring-primary/20"
                    value={formData.recipients || ''}
                    onChange={(e) => handleChangeField('recipients', e.target.value)}
                    onBlur={() => handleBlur('recipients')}
                  />
                  {errors.recipients && <span className="text-red-500 text-xs ml-2">{errors.recipients}</span>}
                </div>
              </div>
              <div className="flex items-center gap-0">
                <span className="min-w-[160px] py-[7px] px-3 bg-slate-100 border border-slate-300 border-r-0 text-[0.845rem] font-semibold text-slate-700 whitespace-nowrap">Additional Text</span>
                <div className="flex-1 flex items-center">
                  <Input
                    type="text"
                    className="max-w-[320px] h-[36px] text-[0.845rem] rounded-none rounded-r-md border-slate-300 shadow-none focus-visible:ring-primary/20"
                    value={formData.additionalText || ''}
                    onChange={(e) => handleChangeField('additionalText', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ══ Approval Details ══ */}
          <div className="mb-7">
            <h3 className="text-[0.95rem] font-bold text-slate-900 mb-3">Approval Details</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-0">
                <span className="min-w-[160px] py-[7px] px-3 bg-slate-100 border border-slate-300 border-r-0 text-[0.845rem] font-semibold text-slate-700 whitespace-nowrap">Reviewing Officer</span>
                <div className="flex-1 flex items-center">
                  <div className="w-[320px]">
                    <Select
                      value={formData.reviewingOfficer}
                      onValueChange={(val) => handleChangeField('reviewingOfficer', val)}
                    >
                      <SelectTrigger 
                        error={!!errors.reviewingOfficer}
                        className="h-[36px] text-[0.845rem] rounded-none rounded-r-md border-slate-300 shadow-none focus:ring-primary/20"
                        onBlur={() => handleBlur('reviewingOfficer')}
                      >
                        <SelectValue placeholder="-- Select Officer --" />
                      </SelectTrigger>
                      <SelectContent>
                        {REVIEWING_OFFICERS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.reviewingOfficer && <span className="text-red-500 text-xs ml-2">{errors.reviewingOfficer}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* ══ Action Buttons ══ */}
          <div className="flex justify-between items-center gap-2.5 pt-4 border-t border-slate-100 mt-4 max-md:flex-col-reverse max-md:items-stretch">
            <Button variant="outline" className="px-5.5 font-medium border-slate-300 text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900" onClick={onBack}>
              Previous
            </Button>
            
            <div className="flex gap-2.5 max-md:flex-col">
              <Button
                variant="outline"
                className="px-5.5 font-medium border-slate-300 text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900"
                onClick={() => handleAction('submit')}
              >
                Submit
              </Button>
              <Button
                className="px-5.5 font-medium bg-[#2b3b7e] hover:bg-[#1e2d6b] text-white"
                onClick={() => handleAction('preview')}
              >
                Preview
              </Button>
            </div>
          </div>

        </div>
      </Card>
    </>
  );
};
