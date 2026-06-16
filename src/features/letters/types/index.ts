export interface Letter {
  id: string;
  subject: string;
  recipientName: string;
  recipientAddress: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt: string;
  letterType: 'with-facility' | 'without-facility';
}

export interface AccountInfo {
  id: string;
  accountNumber: string;
  accountName: string;
  category: string;
  balance: number;
}
