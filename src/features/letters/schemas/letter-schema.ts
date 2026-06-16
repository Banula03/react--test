import { z } from 'zod';

// Reusable date refinement logic
const dateSuperRefine = (data: any, ctx: z.RefinementCtx) => {
  if ((data.fromDate && !data.toDate) || (!data.fromDate && data.toDate)) {
    if (!data.fromDate) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'From Date is required when To Date is set', path: ['fromDate'] });
    }
    if (!data.toDate) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'To Date is required when From Date is set', path: ['toDate'] });
    }
  }

  if (data.fromDate && data.toDate && new Date(data.toDate) < new Date(data.fromDate)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'To Date cannot be before From Date', path: ['toDate'] });
  }
};

const step2SchemaBase = z.object({
  // Step 2 Fields
  br: z.string({ message: 'BR is required' }).min(1, 'BR is required').trim(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  asAtDate: z.string().optional(),
  fullDetails: z.boolean().optional(),
  withOdLimit: z.boolean().optional(),
  withLateFees: z.boolean().optional(),
});

// Schema specifically for Step 2 validation
export const step2Schema = step2SchemaBase.superRefine(dateSuperRefine);

// Full schema for Step 4 validation (includes everything)
export const createLetterSchema = step2SchemaBase.extend({
  // Step 4 Fields
  chargesMode: z.enum(['debit', 'not-applicable', 'manual']),
  chargeAccount: z.string().optional(),
  charges: z.string().optional(),
  
  receiptMode: z.enum(['customer', 'manual', 'from-list']),
  customerName: z.string().min(1, 'Customer Name is required').trim(),
  customerAddress: z.string().min(1, 'Customer Address is required').trim(),
  recipients: z.string().min(1, 'Recipients are required').trim(),
  additionalText: z.string().optional(),
  
  reviewingOfficer: z.string().min(1, 'Please select a Reviewing Officer'),
}).superRefine((data, ctx) => {
  // 1. Date Validation
  dateSuperRefine(data, ctx);

  // 2. Charges Validation
  if (data.chargesMode === 'debit') {
    if (!data.chargeAccount || data.chargeAccount.trim() === '') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Account Number is required for debit', path: ['chargeAccount'] });
    }
  }
  
  if (data.chargesMode !== 'not-applicable') {
    if (!data.charges || data.charges.trim() === '') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Charges amount is required', path: ['charges'] });
    } else if (isNaN(Number(data.charges.replace(/,/g, '')))) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid charges format', path: ['charges'] });
    }
  }
});

export type CreateLetterFormData = z.infer<typeof createLetterSchema>;
