import React, { useState, useEffect } from 'react';
import { step2Schema } from '../schemas/letter-schema';
import type { CreateLetterFormData } from '../schemas/letter-schema';
import { ZodError } from 'zod';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LetterInfoFormProps {
  letterType: 'with-facility' | 'without-facility' | null;
  formData: CreateLetterFormData;
  onChange: (data: CreateLetterFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

export const LetterInfoForm: React.FC<LetterInfoFormProps> = ({
  letterType,
  formData,
  onChange,
  onNext,
  onBack,
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

  // Individual sub-checkbox
  const handleSubCheckboxChange = (
    field: 'withOdLimit' | 'withLateFees',
    checked: boolean
  ) => {
    onChange({ ...formData, [field]: checked });
  };

  const getFormatText = () => {
    let base = "Full Details";
    if (formData.withOdLimit && formData.withLateFees) {
      base = "Full Details with OD Limit & Late Fees";
    } else if (formData.withOdLimit) {
      base = "Full Details with OD Limit";
    } else if (formData.withLateFees) {
      base = "Full Details with Late Fees";
    }

    const typeText = letterType === 'with-facility' 
      ? 'With Facility Breakdown' 
      : 'Without Facility Breakdown';

    return (
      <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md text-sm">
        <div className="font-semibold text-blue-900 mb-1">{base}</div>
        <div className="text-blue-700">{typeText}</div>
      </div>
    );
  };

  const handleClear = () => {
    onChange({
      ...formData,
      br: '',
      fromDate: '',
      toDate: '',
      asAtDate: '',
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
    <Card className="animated-step overflow-hidden pb-8">

      {/* Navy blue header banner */}
      <div className="bg-blue-900 text-white text-center py-4 text-xl font-bold border-b-2 border-blue-800 mb-8">
        Search Screen
      </div>

      <form onSubmit={handleSubmit} className="px-10 flex flex-col gap-3">

        {/* BR Row */}
        <div className="flex items-center gap-4 mb-2 max-md:flex-col max-md:items-stretch">
          <div className="bg-slate-100 border border-slate-300 px-4 py-2.5 font-semibold text-sm text-slate-700 w-[140px] rounded flex items-center justify-center max-md:w-full">
            BR
          </div>
          <div className="flex-1">
            <Input
              id="br"
              type="text"
              error={!!errors.br}
              className="max-w-[400px]"
              value={formData.br}
              onChange={(e) => handleChangeField('br', e.target.value)}
              onBlur={() => handleBlur('br')}
              placeholder="Enter BR code"
            />
            {errors.br && (
              <div className="text-red-500 text-xs mt-1">
                {errors.br}
              </div>
            )}
          </div>
        </div>

        {/* Duration Row */}
        <div className="flex items-start gap-4 mb-2 max-md:flex-col max-md:items-stretch">
          <div className="bg-slate-100 border border-slate-300 px-4 py-2.5 font-semibold text-sm text-slate-700 w-[140px] rounded flex items-center justify-center mt-0 max-md:mt-0 max-md:w-full">
            Duration
          </div>
          <div className="flex gap-6 flex-1 max-md:flex-col max-md:gap-3">
            <div className="flex flex-col gap-1">
              <Label className="text-xs font-semibold text-slate-600">From Date :</Label>
              <Input
                type="date"
                error={!!errors.fromDate}
                value={formData.fromDate || ''}
                onChange={(e) => handleChangeField('fromDate', e.target.value)}
                onBlur={() => handleBlur('fromDate')}
                className="w-[220px]"
              />
              {errors.fromDate && <div className="text-red-500 text-xs mt-1">{errors.fromDate}</div>}
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs font-semibold text-slate-600">To Date :</Label>
              <Input
                type="date"
                error={!!errors.toDate}
                value={formData.toDate || ''}
                onChange={(e) => handleChangeField('toDate', e.target.value)}
                onBlur={() => handleBlur('toDate')}
                className="w-[220px]"
              />
              {errors.toDate && <div className="text-red-500 text-xs mt-1">{errors.toDate}</div>}
            </div>
          </div>
        </div>

        {/* As at Date Row */}
        <div className="flex items-start gap-4 mb-2 max-md:flex-col max-md:items-stretch">
          <div className="bg-slate-100 border border-slate-300 px-4 py-2.5 font-semibold text-sm text-slate-700 w-[140px] rounded flex items-center justify-center mt-0 max-md:mt-0 max-md:w-full">
            As at Date
          </div>
          <div className="flex flex-col gap-1 mt-0 max-md:mt-0">
            <Input
              type="date"
              error={!!errors.asAtDate}
              value={formData.asAtDate || ''}
              onChange={(e) => handleChangeField('asAtDate', e.target.value)}
              onBlur={() => handleBlur('asAtDate')}
              className="w-[220px]"
            />
            {errors.asAtDate && <div className="text-red-500 text-xs mt-1">{errors.asAtDate}</div>}
          </div>
        </div>

        {/* ─── Checkbox Group ─────────────────────────────────── */}
        <div className="border-t border-slate-200 pt-3 flex flex-col gap-2">
          <div className="text-[0.78rem] font-bold uppercase tracking-widest text-slate-400">Detail Options</div>

          <div className="flex flex-col gap-1.5">

            {/* Independent Sub-checkboxes */}
            <div className="flex flex-col gap-1.5">

              <Label
                className={cn(
                  "flex items-center gap-3.5 px-4.5 py-3.5 rounded-lg border-[1.5px] border-slate-200 bg-white cursor-pointer transition-all duration-200 select-none hover:border-blue-300 hover:bg-blue-50/50",
                  formData.withOdLimit && "border-blue-400 bg-blue-50/80"
                )}
              >
                <div className="relative shrink-0">
                  <Checkbox
                    checked={!!formData.withOdLimit}
                    onCheckedChange={(checked) => handleSubCheckboxChange('withOdLimit', checked as boolean)}
                    className={cn(
                      "w-5 h-5 rounded-[5px] border-2 border-slate-300 transition-colors duration-150 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500",
                      formData.withOdLimit && "border-blue-500 bg-blue-500"
                    )}
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className={cn("text-sm font-semibold leading-none", !formData.withOdLimit ? "text-slate-600" : "text-slate-900")}>With OD Limit</span>
                  <span className="text-[0.78rem] text-slate-500">Include overdraft limit details</span>
                </div>
              </Label>

              <Label
                className={cn(
                  "flex items-center gap-3.5 px-4.5 py-3.5 rounded-lg border-[1.5px] border-slate-200 bg-white cursor-pointer transition-all duration-200 select-none hover:border-blue-300 hover:bg-blue-50/50",
                  formData.withLateFees && "border-blue-400 bg-blue-50/80"
                )}
              >
                <div className="relative shrink-0">
                  <Checkbox
                    checked={!!formData.withLateFees}
                    onCheckedChange={(checked) => handleSubCheckboxChange('withLateFees', checked as boolean)}
                    className={cn(
                      "w-5 h-5 rounded-[5px] border-2 border-slate-300 transition-colors duration-150 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500",
                      formData.withLateFees && "border-blue-500 bg-blue-500"
                    )}
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className={cn("text-sm font-semibold leading-none", !formData.withLateFees ? "text-slate-600" : "text-slate-900")}>With Late Fees</span>
                  <span className="text-[0.78rem] text-slate-500">Include any accrued late fees</span>
                </div>
              </Label>

            </div>{/* end sub-group */}
            
            {/* Dynamic Format Text Display */}
            {getFormatText()}
            
          </div>{/* end checkbox-group */}
        </div>
        {/* ─── end Checkbox Group ──────────────────────────────── */}

        {/* Action buttons */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-200 max-md:flex-col-reverse max-md:gap-4 max-md:items-stretch\">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="px-5 font-medium border-slate-300 text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900"
          >
            Previous
          </Button>
          
          <div className="flex gap-3 max-md:flex-col">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClear}
              className="px-5 bg-slate-100 border border-slate-300 text-slate-700 shadow-sm hover:bg-slate-200 hover:border-slate-400"
            >
              Clear
            </Button>
            <Button
              type="submit"
              variant="secondary"
              disabled={!isFormValid}
              className={cn(
                "px-5 bg-slate-100 border border-slate-300 text-slate-700 shadow-sm hover:bg-slate-200 hover:border-slate-400",
                !isFormValid && "opacity-60 cursor-not-allowed"
              )}
            >
              Search
            </Button>
          </div>
        </div>

      </form>
    </Card>
  );
};
