import React, { useState } from 'react';

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
    <div className="wizard-card animated-step" style={{ padding: 0, overflow: 'hidden' }}>

      {/* ── Purple gradient header ── */}
      <div className="dds-header">
        Data Display Screen
      </div>

      <div style={{ padding: '28px 32px 32px' }}>

        {/* ── Customer info block ── */}
        <div className="dds-customer-grid">
          <div className="dds-customer-row">
            <span className="dds-customer-label">Customer CIF</span>
            <span className="dds-customer-value">-</span>
          </div>
          <div className="dds-customer-row">
            <span className="dds-customer-label">Customer Name</span>
            <span className="dds-customer-value">-</span>
          </div>
          <div className="dds-customer-row">
            <span className="dds-customer-label">Customer BR</span>
            <span className="dds-customer-value">-</span>
          </div>
          <div className="dds-customer-row">
            <span className="dds-customer-label">Customer Address</span>
            <span className="dds-customer-value">-</span>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            DEPOSIT ACCOUNTS
        ══════════════════════════════════════════ */}
        <div className="dds-section">
          <div className="dds-section-title">Deposit Accounts</div>

          <div className="dds-table-wrapper">
            <table className="dds-table">
              <thead>
                <tr>
                  <th>Type of Account</th>
                  <th>Account No</th>
                  <th>Currency Type</th>
                  <th>Balance as at<br /><span className="dds-th-sub">DD/MM/YYYY</span></th>
                  <th>Overdraft<br />Facility</th>
                  <th>
                    Overdraft Interest Charged<br />
                    <span className="dds-th-sub">(From DD/MM/YYYY to DD/MM/YYYY)</span>
                  </th>
                  <th style={{ width: '36px' }}></th>
                </tr>
              </thead>
              <tbody>
                {pagedDeposits.map((acc) => (
                  <tr key={acc.id} className={selectedAccounts.includes(acc.id) ? 'dds-row-selected' : ''}>
                    <td className="dds-td-link">{acc.typeOfAccount}</td>
                    <td>{acc.accountNo}</td>
                    <td>{acc.currencyType}</td>
                    <td className="dds-td-num">{acc.balanceAsAt}</td>
                    <td className="dds-td-num">{acc.overdraftFacility}</td>
                    <td className="dds-td-num">{acc.overdraftInterestCharged}</td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        className="dds-checkbox"
                        checked={selectedAccounts.includes(acc.id)}
                        onChange={() => onToggleAccount(acc.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="dds-pagination">
            <button
              className="dds-page-btn"
              disabled={depositPage === 1}
              onClick={() => setDepositPage((p) => Math.max(1, p - 1))}
            >
              &lt;
            </button>
            {Array.from({ length: totalDepositPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`dds-page-btn ${p === depositPage ? 'dds-page-btn-active' : ''}`}
                onClick={() => setDepositPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="dds-page-btn"
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
          <div className="dds-section">
            <div className="dds-section-title">Leasing Facilities</div>

            <div className="dds-table-wrapper">
              <table className="dds-table">
                <thead>
                  <tr>
                    <th rowSpan={2}>Type of<br />Facilities</th>
                    <th rowSpan={2}>Loan<br />Number</th>
                    <th rowSpan={2}>Currency<br />Type</th>
                    <th rowSpan={2}>
                      Capital Outstanding<br />
                      <span className="dds-th-sub">as at DD/MM/YYYY</span>
                    </th>
                    <th colSpan={3} style={{ textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
                      Recoveries during the period<br />
                      <span className="dds-th-sub">(From DD/MM/YYYY to DD/MM/YYYY)</span>
                    </th>
                    <th rowSpan={2} style={{ width: '36px' }}></th>
                  </tr>
                  <tr>
                    <th>Capital</th>
                    <th>Interest</th>
                    <th style={{ borderRight: '1px solid #e2e8f0' }}>Late Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedLeasing.map((fac) => (
                    <tr key={fac.id} className={selectedAccounts.includes(fac.id) ? 'dds-row-selected' : ''}>
                      <td className="dds-td-link">{fac.typeOfFacilities}</td>
                      <td>{fac.loanNumber}</td>
                      <td>{fac.currencyType}</td>
                      <td className="dds-td-num">{fac.capitalOutstanding}</td>
                      <td className="dds-td-num">{fac.recoveriesCapital}</td>
                      <td className="dds-td-num">{fac.recoveriesInterest}</td>
                      <td className="dds-td-num">{fac.recoveriesLateFee}</td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          className="dds-checkbox"
                          checked={selectedAccounts.includes(fac.id)}
                          onChange={() => onToggleAccount(fac.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="dds-pagination">
              <button
                className="dds-page-btn"
                disabled={leasingPage === 1}
                onClick={() => setLeasingPage((p) => Math.max(1, p - 1))}
              >
                &lt;
              </button>
              {Array.from({ length: totalLeasingPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`dds-page-btn ${p === leasingPage ? 'dds-page-btn-active' : ''}`}
                  onClick={() => setLeasingPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="dds-page-btn"
                disabled={leasingPage === totalLeasingPages}
                onClick={() => setLeasingPage((p) => Math.min(totalLeasingPages, p + 1))}
              >
                &gt;
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="wizard-actions" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px', marginTop: '8px' }}>
          <div className="button-group">
            <button className="btn-secondary" onClick={onBack}>Previous</button>
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

      </div>
    </div>
  );
};
