export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  TRANSFER = "TRANSFER",
}

export type Transaction = {
  id: string;
  amount: number;
  type: TransactionType;
  description?: string;
  createdAt: Date;
};
