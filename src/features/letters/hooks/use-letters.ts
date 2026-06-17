import { useState, useEffect } from 'react';
import type { CreateLetterFormData } from '../schemas/letter-schema';
import type { Letter } from '../types';

const STORAGE_KEY = 'corporate_letters_list';

const initialFormData: CreateLetterFormData = {
  br: 'BR-9042',
  fromDate: '2026-06-01',
  toDate: '2026-06-30',
  asAtDate: '2026-06-16',
  fullDetails: false,
  withOdLimit: false,
  withLateFees: false,
  
  chargesMode: 'debit',
  chargeAccount: '10010001000100',
  charges: '750.00',
  
  receiptMode: 'customer',
  customerName: 'ABC Company',
  customerAddress: '72/1, Test Road, Rajagiriya',
  recipients: 'Director/s',
  additionalText: 'Mr. Nimal Perera, CFO',
  
  reviewingOfficer: '',
};

export const useLetters = () => {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [highestStep, setHighestStep] = useState<number>(1);
  const [letterType, setLetterType] = useState<'with-facility' | 'without-facility' | null>(null);
  const [formData, setFormData] = useState<CreateLetterFormData>(initialFormData);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(['checking', 'savings', 'loan']);

  // Load letters from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setLetters(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse letters list', e);
      }
    }
  }, []);

  const saveLetters = (newList: Letter[]) => {
    setLetters(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  };

  const handleSelectType = (type: 'with-facility' | 'without-facility') => {
    setLetterType(type);
    // Auto-adjust accounts selection if we go back and forth
    if (type === 'without-facility') {
      setSelectedAccounts((prev) => prev.filter((id) => id !== 'loan'));
    } else {
      if (!selectedAccounts.includes('loan')) {
        setSelectedAccounts((prev) => [...prev, 'loan']);
      }
    }
  };

  const handleUpdateFormData = (newData: CreateLetterFormData) => {
    setFormData(newData);
  };

  const handleToggleAccount = (accountId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleNext = () => {
    setCurrentStep((prev) => {
      const next = prev + 1;
      setHighestStep((h) => Math.max(h, next));
      return next;
    });
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const submitLetter = () => {
    if (!letterType) return;
    
    /*
     * TODO: BACKEND INTEGRATION - FINAL SUBMISSION
     * This is where you will send the final data to your backend API to generate the letter.
     * You have access to:
     * 1. `formData`: All the form inputs (BR, Dates, Customer Details, etc.)
     * 2. `selectedAccounts`: Array of IDs of the accounts the user selected.
     * 3. `letterType`: Whether it includes facility tables or not.
     * 
     * Example:
     * const response = await fetch('/api/letters/generate', {
     *   method: 'POST',
     *   body: JSON.stringify({ letterType, formData, selectedAccounts })
     * });
     * const jasperUrl = await response.json().url;
     */

    const newLetter: Letter = {
      id: Math.random().toString(36).substring(2, 9),
      subject: `Account Balance & Facility Confirmation (Branch: ${formData.br})`,
      recipientName: formData.customerName || 'Acme Corporation Ltd',
      recipientAddress: formData.customerAddress || '100 Innovation Way, Tech District, Suite 400',
      status: 'pending', // Initially pending approval
      createdAt: new Date().toISOString(),
      letterType,
    };

    saveLetters([newLetter, ...letters]);
    setCurrentStep(5); // Success step
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setHighestStep(1);
    setLetterType(null);
    setFormData(initialFormData);
    setSelectedAccounts(['checking', 'savings', 'loan']);
  };

  return {
    letters,
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
    jumpToStep: (step: number) => {
      if (step <= highestStep) {
        setCurrentStep(step);
      }
    },
    submitLetter,
    resetWizard,
  };
};
