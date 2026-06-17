import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DepositAccount {
  id: string;
  typeOfAccount: string;
  accountNo: string;
  currencyType: string;
  balanceAsAt: string;
  overdraftFacility: string;
  overdraftInterestCharged: string;
}

interface LeasingFacility {
  id: string;
  typeOfFacilities: string;
  loanNumber: string;
  currencyType: string;
  capitalOutstanding: string;
  recoveriesCapital: string;
  recoveriesInterest: string;
  recoveriesLateFee: string;
}

interface AccountsSelectionProps {
  letterType: 'with-facility' | 'without-facility';
  selectedAccounts: string[];
  onToggleAccount: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
}

/*
 * TODO: BACKEND INTEGRATION - POPULATE DYNAMIC DATA
 * These arrays and the customer info below currently contain placeholder data.
 * Once connected to the backend (via useLetters or a context), you should pass
 * the fetched `DepositAccount[]` and `LeasingFacility[]` as props to this component
 * instead of using these hardcoded constants.
 * You'll also pass the `CustomerInfo` object (Name, Address, BR, CIF) as a prop.
 */
const DEPOSIT_ACCOUNTS: DepositAccount[] = [
  { id: 'empty-d1', typeOfAccount: '-', accountNo: '-', currencyType: '-', balanceAsAt: '-', overdraftFacility: '-', overdraftInterestCharged: '-' },
];

const LEASING_FACILITIES: LeasingFacility[] = [
  { id: 'empty-l1', typeOfFacilities: '-', loanNumber: '-', currencyType: '-', capitalOutstanding: '-', recoveriesCapital: '-', recoveriesInterest: '-', recoveriesLateFee: '-' },
];

const DEPOSIT_PAGE_SIZE = 5;

export const AccountsSelection: React.FC<AccountsSelectionProps> = ({
  letterType,
  selectedAccounts,
  onToggleAccount,
  onNext,
  onBack,
  isValid,
}) => {
  const [depositPage, setDepositPage] = useState(1);
  const [leasingPage, setLeasingPage] = useState(1);

  const totalDepositPages = Math.ceil(DEPOSIT_ACCOUNTS.length / DEPOSIT_PAGE_SIZE);
  const pagedDeposits = DEPOSIT_ACCOUNTS.slice(
    (depositPage - 1) * DEPOSIT_PAGE_SIZE,
    depositPage * DEPOSIT_PAGE_SIZE
  );

  const visibleLeasing = letterType === 'with-facility' ? LEASING_FACILITIES : [];
  
  const LEASING_PAGE_SIZE = 5;
  const totalLeasingPages = Math.ceil(visibleLeasing.length / LEASING_PAGE_SIZE);
  const pagedLeasing = visibleLeasing.slice(
    (leasingPage - 1) * LEASING_PAGE_SIZE,
    leasingPage * LEASING_PAGE_SIZE
  );

  return (
    <Card className="animated-step overflow-hidden p-0">

      {/* ── Purple gradient header ── */}
      <div className="bg-gradient-to-r from-[#2b3b7e] to-[#4a5da6] text-white py-3 px-6 text-xl font-semibold text-center">
        Data Display Screen
      </div>

      <div className="p-7 px-8 pb-8">

        {/* ── Customer info block ── */}
        <div className="grid grid-cols-1 gap-[1px] bg-slate-300 border border-slate-300 rounded max-w-[600px] mb-8">
          <div className="flex bg-white">
            <span className="w-[200px] py-2 px-4 bg-slate-100 font-semibold text-[0.85rem] text-slate-700 border-r border-slate-300 flex items-center">Customer CIF</span>
            <span className="py-2 px-4 text-[0.85rem] text-slate-600 flex-1 flex items-center">-</span>
          </div>
          <div className="flex bg-white">
            <span className="w-[200px] py-2 px-4 bg-slate-100 font-semibold text-[0.85rem] text-slate-700 border-r border-slate-300 flex items-center">Customer Name</span>
            <span className="py-2 px-4 text-[0.85rem] text-slate-600 flex-1 flex items-center">-</span>
          </div>
          <div className="flex bg-white">
            <span className="w-[200px] py-2 px-4 bg-slate-100 font-semibold text-[0.85rem] text-slate-700 border-r border-slate-300 flex items-center">Customer BR</span>
            <span className="py-2 px-4 text-[0.85rem] text-slate-600 flex-1 flex items-center">-</span>
          </div>
          <div className="flex bg-white">
            <span className="w-[200px] py-2 px-4 bg-slate-100 font-semibold text-[0.85rem] text-slate-700 border-r border-slate-300 flex items-center">Customer Address</span>
            <span className="py-2 px-4 text-[0.85rem] text-slate-600 flex-1 flex items-center">-</span>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            DEPOSIT ACCOUNTS
        ══════════════════════════════════════════ */}
        <div className="mb-9">
          <div className="text-lg font-semibold text-slate-900 mb-3">Deposit Accounts</div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <Table className="text-[0.85rem]">
              <TableHeader className="bg-slate-50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-slate-700 align-bottom whitespace-nowrap border-r border-slate-200">Type of Account</TableHead>
                  <TableHead className="font-semibold text-slate-700 align-bottom whitespace-nowrap border-r border-slate-200">Account No</TableHead>
                  <TableHead className="font-semibold text-slate-700 align-bottom whitespace-nowrap border-r border-slate-200">Currency Type</TableHead>
                  <TableHead className="font-semibold text-slate-700 align-bottom whitespace-nowrap border-r border-slate-200">
                    Balance as at<br /><span className="text-xs font-normal text-slate-500 block mt-0.5">DD/MM/YYYY</span>
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 align-bottom whitespace-nowrap border-r border-slate-200">Overdraft<br />Facility</TableHead>
                  <TableHead className="font-semibold text-slate-700 align-bottom whitespace-nowrap border-r border-slate-200">
                    Overdraft Interest Charged<br />
                    <span className="text-xs font-normal text-slate-500 block mt-0.5">(From DD/MM/YYYY to DD/MM/YYYY)</span>
                  </TableHead>
                  <TableHead className="w-9" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedDeposits.map((acc) => (
                  <TableRow key={acc.id} className={cn("hover:bg-slate-100 transition-colors", selectedAccounts.includes(acc.id) && "bg-blue-50")}>
                    <TableCell className="text-sky-600 font-medium cursor-pointer hover:underline border-r border-slate-200">{acc.typeOfAccount}</TableCell>
                    <TableCell className="border-r border-slate-200">{acc.accountNo}</TableCell>
                    <TableCell className="border-r border-slate-200">{acc.currencyType}</TableCell>
                    <TableCell className="text-right tabular-nums border-r border-slate-200">{acc.balanceAsAt}</TableCell>
                    <TableCell className="text-right tabular-nums border-r border-slate-200">{acc.overdraftFacility}</TableCell>
                    <TableCell className="text-right tabular-nums border-r border-slate-200">{acc.overdraftInterestCharged}</TableCell>
                    <TableCell className="text-center p-0 align-middle">
                      <div className="flex justify-center h-full items-center">
                        <Checkbox
                          checked={selectedAccounts.includes(acc.id)}
                          onCheckedChange={() => onToggleAccount(acc.id)}
                          className="data-[state=checked]:bg-[#2b3b7e] data-[state=checked]:border-[#2b3b7e]"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end gap-2 mt-3 pr-3">
            <button
              className="bg-transparent border-none p-1.5 text-[0.85rem] font-bold text-slate-600 cursor-pointer rounded-sm hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={depositPage === 1}
              onClick={() => setDepositPage((p) => Math.max(1, p - 1))}
            >
              &lt;
            </button>
            {Array.from({ length: totalDepositPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={cn(
                  "bg-transparent p-1.5 text-[0.85rem] font-bold text-slate-600 cursor-pointer rounded-sm hover:text-slate-900",
                  p === depositPage ? "border-[1.5px] border-slate-500 text-slate-700" : "border-none"
                )}
                onClick={() => setDepositPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="bg-transparent border-none p-1.5 text-[0.85rem] font-bold text-slate-600 cursor-pointer rounded-sm hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={depositPage === totalDepositPages}
              onClick={() => setDepositPage((p) => Math.min(totalDepositPages, p + 1))}
            >
              &gt;
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            LEASING FACILITIES (only for with-facility)
        ══════════════════════════════════════════ */}
        {visibleLeasing.length > 0 && (
          <div className="mb-9">
            <div className="text-lg font-semibold text-slate-900 mb-3">Leasing Facilities</div>

            <div className="overflow-x-auto border border-slate-200 rounded">
              <Table className="text-[0.85rem]">
                <TableHeader className="bg-slate-50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead rowSpan={2} className="font-semibold text-slate-700 align-bottom whitespace-nowrap border-r border-slate-200">Type of<br />Facilities</TableHead>
                    <TableHead rowSpan={2} className="font-semibold text-slate-700 align-bottom whitespace-nowrap border-r border-slate-200">Loan<br />Number</TableHead>
                    <TableHead rowSpan={2} className="font-semibold text-slate-700 align-bottom whitespace-nowrap border-r border-slate-200">Currency<br />Type</TableHead>
                    <TableHead rowSpan={2} className="font-semibold text-slate-700 align-bottom whitespace-nowrap border-r border-slate-200">
                      Capital Outstanding<br />
                      <span className="text-xs font-normal text-slate-500 block mt-0.5">as at DD/MM/YYYY</span>
                    </TableHead>
                    <TableHead colSpan={3} className="text-center border-b border-slate-200 font-semibold text-slate-700 border-r border-slate-200">
                      Recoveries during the period<br />
                      <span className="text-xs font-normal text-slate-500 block mt-0.5">(From DD/MM/YYYY to DD/MM/YYYY)</span>
                    </TableHead>
                    <TableHead rowSpan={2} className="w-9" />
                  </TableRow>
                  <TableRow className="hover:bg-transparent bg-slate-50">
                    <TableHead className="font-semibold text-slate-700 align-bottom whitespace-nowrap border-r border-slate-200">Capital</TableHead>
                    <TableHead className="font-semibold text-slate-700 align-bottom whitespace-nowrap border-r border-slate-200">Interest</TableHead>
                    <TableHead className="font-semibold text-slate-700 align-bottom whitespace-nowrap border-r border-slate-200">Late Fee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedLeasing.map((fac) => (
                    <TableRow key={fac.id} className={cn("hover:bg-slate-100 transition-colors", selectedAccounts.includes(fac.id) && "bg-blue-50")}>
                      <TableCell className="text-sky-600 font-medium cursor-pointer hover:underline border-r border-slate-200">{fac.typeOfFacilities}</TableCell>
                      <TableCell className="border-r border-slate-200">{fac.loanNumber}</TableCell>
                      <TableCell className="border-r border-slate-200">{fac.currencyType}</TableCell>
                      <TableCell className="text-right tabular-nums border-r border-slate-200">{fac.capitalOutstanding}</TableCell>
                      <TableCell className="text-right tabular-nums border-r border-slate-200">{fac.recoveriesCapital}</TableCell>
                      <TableCell className="text-right tabular-nums border-r border-slate-200">{fac.recoveriesInterest}</TableCell>
                      <TableCell className="text-right tabular-nums border-r border-slate-200">{fac.recoveriesLateFee}</TableCell>
                      <TableCell className="text-center p-0 align-middle">
                        <div className="flex justify-center h-full items-center">
                          <Checkbox
                            checked={selectedAccounts.includes(fac.id)}
                            onCheckedChange={() => onToggleAccount(fac.id)}
                            className="data-[state=checked]:bg-[#2b3b7e] data-[state=checked]:border-[#2b3b7e]"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end gap-2 mt-3 pr-3">
              <button
                className="bg-transparent border-none p-1.5 text-[0.85rem] font-bold text-slate-600 cursor-pointer rounded-sm hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={leasingPage === 1}
                onClick={() => setLeasingPage((p) => Math.max(1, p - 1))}
              >
                &lt;
              </button>
              {Array.from({ length: totalLeasingPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={cn(
                    "bg-transparent p-1.5 text-[0.85rem] font-bold text-slate-600 cursor-pointer rounded-sm hover:text-slate-900",
                    p === leasingPage ? "border-[1.5px] border-slate-500 text-slate-700" : "border-none"
                  )}
                  onClick={() => setLeasingPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="bg-transparent border-none p-1.5 text-[0.85rem] font-bold text-slate-600 cursor-pointer rounded-sm hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={leasingPage === totalLeasingPages}
                onClick={() => setLeasingPage((p) => Math.min(totalLeasingPages, p + 1))}
              >
                &gt;
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-end border-t border-slate-100 pt-6 mt-2">
          <div className="flex gap-3 w-full justify-between">
            <Button variant="outline" onClick={onBack}>Previous</Button>
            <Button
              disabled={!isValid}
              onClick={onNext}
            >
              Next Step
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Button>
          </div>
        </div>

      </div>
    </Card>
  );
};
