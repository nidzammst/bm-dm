import { Transaction } from "./transaction-model";

export type AdminAccount = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  transaction: Transaction[];
};

export type MemberSignUp = {
  name: string;
  initialDeposit: number;
  description?: string;
};

export type Member = {
  id: string;
  name: string;
  updatedAt: string;
  balance: number;
  transactions: Transaction[];
  currentTransaction: Transaction[];
};
