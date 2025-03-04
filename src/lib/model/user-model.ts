import { Transaction } from "./transaction-model";

export type CreateAdminRequest = {
  name: string
  email: string
}

export type AdminAccountResponse = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  transaction: Transaction[];
};

export type CreateMemberRequest = {
  name: string
  email: string
}

export type MemberResponse = {
  id: string;
  name: string;
  updatedAt: string;
  balance: number;
  transactions: Transaction[];
  currentTransaction: Transaction[];
};
