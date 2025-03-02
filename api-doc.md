# API Documentation for Savings Dashboard Application

## Overview

This document outlines the API endpoints for the Savings Dashboard application built with Next.js. The application provides functionality for managing savings accounts, members, transactions, and user authentication.

## Base URL

```
https://your-app-domain.com/api
```

## Authentication

Most endpoints require authentication. Authentication is handled using JWT tokens.

### Headers

For protected endpoints, include the following header:

```
Authorization: Bearer {token}
```

## API Endpoints

### Authentication

#### Register a New User

```
POST /auth/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-03-02T10:00:00Z"
  }
}
```

#### Login

```
POST /auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Logout

```
POST /auth/logout
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Get Current User

```
GET /auth/me
```

**Response (200 OK):**

```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2025-03-02T10:00:00Z",
  "updatedAt": "2025-03-02T10:00:00Z"
}
```

### Members

#### Get All Members

```
GET /members
```

**Query Parameters:**

| Parameter | Type    | Description                   |
|-----------|---------|-------------------------------|
| page      | integer | Page number (default: 1)      |
| limit     | integer | Items per page (default: 10)  |
| search    | string  | Search term for member name   |
| sortBy    | string  | Sort field (default: 'name')  |
| order     | string  | 'asc' or 'desc' (default: 'asc') |

**Response (200 OK):**

```json
{
  "members": [
    {
      "id": "member_id",
      "name": "Alice Smith",
      "createdAt": "2025-03-01T10:00:00Z",
      "updatedAt": "2025-03-01T10:00:00Z",
      "totalSavings": 500000
    },
    {
      "id": "member_id2",
      "name": "Bob Johnson",
      "createdAt": "2025-03-01T11:00:00Z",
      "updatedAt": "2025-03-01T11:00:00Z",
      "totalSavings": 750000
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### Get Member by ID

```
GET /members/{memberId}
```

**Response (200 OK):**

```json
{
  "id": "member_id",
  "name": "Alice Smith",
  "createdAt": "2025-03-01T10:00:00Z",
  "updatedAt": "2025-03-01T10:00:00Z",
  "totalSavings": 500000,
  "recentTransactions": [
    {
      "id": "transaction_id",
      "amount": 100000,
      "type": "deposit",
      "description": "Monthly savings",
      "createdAt": "2025-03-01T10:00:00Z"
    }
  ]
}
```

#### Create a New Member

```
POST /members
```

**Request Body:**

```json
{
  "name": "Charlie Brown",
  "initialDeposit": 200000,
  "description": "New member registration"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Member created successfully",
  "member": {
    "id": "member_id",
    "name": "Charlie Brown",
    "createdAt": "2025-03-02T10:00:00Z",
    "updatedAt": "2025-03-02T10:00:00Z"
  },
  "transaction": {
    "id": "transaction_id",
    "amount": 200000,
    "type": "deposit",
    "description": "New member registration",
    "createdAt": "2025-03-02T10:00:00Z"
  }
}
```

#### Update a Member

```
PUT /members/{memberId}
```

**Request Body:**

```json
{
  "name": "Charles Brown"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Member updated successfully",
  "member": {
    "id": "member_id",
    "name": "Charles Brown",
    "createdAt": "2025-03-01T10:00:00Z",
    "updatedAt": "2025-03-02T10:00:00Z"
  }
}
```

#### Delete a Member

```
DELETE /members/{memberId}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Member deleted successfully"
}
```

### Accounts

#### Get All Accounts

```
GET /accounts
```

**Query Parameters:**

| Parameter | Type    | Description                   |
|-----------|---------|-------------------------------|
| page      | integer | Page number (default: 1)      |
| limit     | integer | Items per page (default: 10)  |
| search    | string  | Search term for account name  |

**Response (200 OK):**

```json
{
  "accounts": [
    {
      "id": "account_id",
      "name": "Personal Savings",
      "description": "My personal savings account",
      "balance": 1500000,
      "createdAt": "2025-02-20T10:00:00Z",
      "updatedAt": "2025-03-01T15:30:00Z"
    },
    {
      "id": "account_id2",
      "name": "Emergency Fund",
      "description": "For unexpected expenses",
      "balance": 5000000,
      "createdAt": "2025-01-15T09:00:00Z",
      "updatedAt": "2025-03-01T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

#### Get Account by ID

```
GET /accounts/{accountId}
```

**Response (200 OK):**

```json
{
  "id": "account_id",
  "name": "Personal Savings",
  "description": "My personal savings account",
  "balance": 1500000,
  "createdAt": "2025-02-20T10:00:00Z",
  "updatedAt": "2025-03-01T15:30:00Z",
  "recentTransactions": [
    {
      "id": "transaction_id",
      "amount": 500000,
      "type": "deposit",
      "description": "Monthly savings",
      "createdAt": "2025-03-01T15:30:00Z",
      "member": {
        "id": "member_id",
        "name": "Alice Smith"
      }
    }
  ]
}
```

#### Create a New Account

```
POST /accounts
```

**Request Body:**

```json
{
  "name": "Vacation Fund",
  "description": "Saving for summer vacation",
  "initialBalance": 1000000
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Account created successfully",
  "account": {
    "id": "account_id",
    "name": "Vacation Fund",
    "description": "Saving for summer vacation",
    "balance": 1000000,
    "createdAt": "2025-03-02T10:00:00Z",
    "updatedAt": "2025-03-02T10:00:00Z"
  }
}
```

#### Update an Account

```
PUT /accounts/{accountId}
```

**Request Body:**

```json
{
  "name": "Vacation Fund 2025",
  "description": "Saving for summer vacation in Bali"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Account updated successfully",
  "account": {
    "id": "account_id",
    "name": "Vacation Fund 2025",
    "description": "Saving for summer vacation in Bali",
    "balance": 1000000,
    "createdAt": "2025-03-01T10:00:00Z",
    "updatedAt": "2025-03-02T10:00:00Z"
  }
}
```

#### Delete an Account

```
DELETE /accounts/{accountId}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

### Transactions

#### Get All Transactions

```
GET /transactions
```

**Query Parameters:**

| Parameter   | Type    | Description                      |
|-------------|---------|----------------------------------|
| page        | integer | Page number (default: 1)         |
| limit       | integer | Items per page (default: 20)     |
| accountId   | string  | Filter by account ID             |
| memberId    | string  | Filter by member ID              |
| type        | string  | 'deposit' or 'withdrawal'        |
| startDate   | string  | Filter by date (ISO format)      |
| endDate     | string  | Filter by date (ISO format)      |
| minAmount   | number  | Minimum transaction amount       |
| maxAmount   | number  | Maximum transaction amount       |
| sortBy      | string  | Sort field (default: 'createdAt')|
| order       | string  | 'asc' or 'desc' (default: 'desc')|

**Response (200 OK):**

```json
{
  "transactions": [
    {
      "id": "transaction_id",
      "amount": 500000,
      "type": "deposit",
      "description": "Monthly savings",
      "createdAt": "2025-03-01T15:30:00Z",
      "account": {
        "id": "account_id",
        "name": "Personal Savings"
      },
      "member": {
        "id": "member_id",
        "name": "Alice Smith"
      }
    },
    {
      "id": "transaction_id2",
      "amount": 250000,
      "type": "withdrawal",
      "description": "Emergency expense",
      "createdAt": "2025-02-28T09:15:00Z",
      "account": {
        "id": "account_id",
        "name": "Personal Savings"
      },
      "member": {
        "id": "member_id",
        "name": "Bob Johnson"
      }
    }
  ],
  "pagination": {
    "total": 120,
    "page": 1,
    "limit": 20,
    "totalPages": 6
  }
}
```

#### Get Transaction by ID

```
GET /transactions/{transactionId}
```

**Response (200 OK):**

```json
{
  "id": "transaction_id",
  "amount": 500000,
  "type": "deposit",
  "description": "Monthly savings",
  "createdAt": "2025-03-01T15:30:00Z",
  "updatedAt": "2025-03-01T15:30:00Z",
  "account": {
    "id": "account_id",
    "name": "Personal Savings"
  },
  "member": {
    "id": "member_id",
    "name": "Alice Smith"
  }
}
```

#### Create a New Transaction

```
POST /transactions
```

**Request Body:**

```json
{
  "accountId": "account_id",
  "memberId": "member_id",
  "amount": 300000,
  "type": "deposit",
  "description": "Monthly savings"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Transaction created successfully",
  "transaction": {
    "id": "transaction_id",
    "amount": 300000,
    "type": "deposit",
    "description": "Monthly savings",
    "createdAt": "2025-03-02T10:00:00Z",
    "account": {
      "id": "account_id",
      "name": "Personal Savings",
      "balance": 1800000
    },
    "member": {
      "id": "member_id",
      "name": "Alice Smith"
    }
  }
}
```

#### Update a Transaction

```
PUT /transactions/{transactionId}
```

**Request Body:**

```json
{
  "description": "Monthly savings contribution"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Transaction updated successfully",
  "transaction": {
    "id": "transaction_id",
    "amount": 300000,
    "type": "deposit",
    "description": "Monthly savings contribution",
    "createdAt": "2025-03-01T15:30:00Z",
    "updatedAt": "2025-03-02T10:00:00Z",
    "account": {
      "id": "account_id",
      "name": "Personal Savings"
    },
    "member": {
      "id": "member_id",
      "name": "Alice Smith"
    }
  }
}
```

#### Delete a Transaction

```
DELETE /transactions/{transactionId}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Transaction deleted successfully",
  "updatedBalance": 1500000
}
```

### Dashboard Analytics

#### Get Dashboard Summary

```
GET /dashboard/summary
```

**Response (200 OK):**

```json
{
  "totalBalance": 7500000,
  "totalMembers": 50,
  "totalAccounts": 5,
  "recentTransactions": [
    {
      "id": "transaction_id",
      "amount": 500000,
      "type": "deposit",
      "account": "Personal Savings",
      "member": "Alice Smith",
      "createdAt": "2025-03-01T15:30:00Z"
    }
  ],
  "topMembers": [
    {
      "id": "member_id",
      "name": "Bob Johnson",
      "totalSavings": 2500000
    }
  ]
}
```

#### Get Transaction Statistics

```
GET /dashboard/statistics
```

**Query Parameters:**

| Parameter | Type   | Description                                 |
|-----------|--------|---------------------------------------------|
| period    | string | 'day', 'week', 'month', 'year' (default: 'month') |
| accountId | string | Filter by account ID (optional)            |

**Response (200 OK):**

```json
{
  "period": "month",
  "totalDeposits": 10000000,
  "totalWithdrawals": 4000000,
  "netSavings": 6000000,
  "transactionCount": 45,
  "timeSeriesData": [
    {
      "date": "2025-02-01",
      "deposits": 2500000,
      "withdrawals": 1000000,
      "netSavings": 1500000
    },
    {
      "date": "2025-03-01",
      "deposits": 7500000,
      "withdrawals": 3000000,
      "netSavings": 4500000
    }
  ]
}
```

### Reports

#### Generate Savings Report

```
GET /reports/savings
```

**Query Parameters:**

| Parameter  | Type   | Description                               |
|------------|--------|-------------------------------------------|
| startDate  | string | Start date (ISO format)                   |
| endDate    | string | End date (ISO format)                     |
| accountId  | string | Filter by account ID (optional)           |
| memberId   | string | Filter by member ID (optional)            |
| format     | string | 'json', 'csv', 'pdf' (default: 'json')    |

**Response (200 OK, for format=json):**

```json
{
  "reportTitle": "Savings Report (2025-02-01 to 2025-03-01)",
  "generatedAt": "2025-03-02T10:00:00Z",
  "summary": {
    "totalDeposits": 10000000,
    "totalWithdrawals": 4000000,
    "netSavings": 6000000,
    "transactionCount": 45
  },
  "accountSummaries": [
    {
      "accountName": "Personal Savings",
      "initialBalance": 1500000,
      "finalBalance": 3000000,
      "deposits": 2000000,
      "withdrawals": 500000
    }
  ],
  "memberSummaries": [
    {
      "memberName": "Alice Smith",
      "deposits": 3000000,
      "withdrawals": 1000000,
      "netContribution": 2000000
    }
  ],
  "transactions": [
    {
      "date": "2025-02-15T10:00:00Z",
      "accountName": "Personal Savings",
      "memberName": "Alice Smith",
      "type": "deposit",
      "amount": 500000,
      "description": "Monthly savings"
    }
  ]
}
```

#### Generate Member Report

```
GET /reports/members/{memberId}
```

**Query Parameters:**

| Parameter  | Type   | Description                               |
|------------|--------|-------------------------------------------|
| startDate  | string | Start date (ISO format)                   |
| endDate    | string | End date (ISO format)                     |
| format     | string | 'json', 'csv', 'pdf' (default: 'json')    |

**Response (200 OK, for format=json):**

```json
{
  "member": {
    "id": "member_id",
    "name": "Alice Smith",
    "createdAt": "2024-01-15T09:00:00Z"
  },
  "reportPeriod": {
    "startDate": "2025-02-01T00:00:00Z",
    "endDate": "2025-03-01T23:59:59Z"
  },
  "summary": {
    "totalDeposits": 3000000,
    "totalWithdrawals": 1000000,
    "netSavings": 2000000,
    "transactionCount": 10,
    "currentSavingsBalance": 5000000
  },
  "monthlySummary": [
    {
      "month": "February 2025",
      "deposits": 1500000,
      "withdrawals": 500000,
      "netSavings": 1000000
    },
    {
      "month": "March 2025",
      "deposits": 1500000,
      "withdrawals": 500000,
      "netSavings": 1000000
    }
  ],
  "transactions": [
    {
      "date": "2025-02-15T10:00:00Z",
      "account": "Personal Savings",
      "type": "deposit",
      "amount": 500000,
      "description": "Monthly savings"
    }
  ]
}
```

### Settings

#### Get Application Settings

```
GET /settings
```

**Response (200 OK):**

```json
{
  "appName": "Tabungan App",
  "currency": "IDR",
  "dateFormat": "DD/MM/YYYY",
  "theme": "light",
  "defaultPaginationLimit": 20,
  "emailNotifications": true,
  "backupFrequency": "daily"
}
```

#### Update Application Settings

```
PUT /settings
```

**Request Body:**

```json
{
  "appName": "My Savings App",
  "currency": "IDR",
  "dateFormat": "YYYY-MM-DD",
  "theme": "dark",
  "defaultPaginationLimit": 25,
  "emailNotifications": true,
  "backupFrequency": "weekly"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Settings updated successfully",
  "settings": {
    "appName": "My Savings App",
    "currency": "IDR",
    "dateFormat": "YYYY-MM-DD",
    "theme": "dark",
    "defaultPaginationLimit": 25,
    "emailNotifications": true,
    "backupFrequency": "weekly"
  }
}
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Invalid request",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "You do not have permission to perform this action"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "An unexpected error occurred",
  "errorId": "error_id"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. By default, clients are limited to 100 requests per minute. When the rate limit is exceeded, the API will respond with a 429 Too Many Requests status code.

**Headers included in all responses:**

```
X-Rate-Limit-Limit: 100
X-Rate-Limit-Remaining: 95
X-Rate-Limit-Reset: 1614679200
```

## Webhooks

The application supports webhooks for real-time notifications about specific events.

### Available Events

- `transaction.created`
- `transaction.updated`
- `transaction.deleted`
- `member.created`
- `member.updated`
- `member.deleted`
- `account.balance.updated`

### Webhook Payload Example

```json
{
  "event": "transaction.created",
  "timestamp": "2025-03-02T10:00:00Z",
  "data": {
    "transaction": {
      "id": "transaction_id",
      "amount": 500000,
      "type": "deposit",
      "description": "Monthly savings",
      "createdAt": "2025-03-02T10:00:00Z",
      "account": {
        "id": "account_id",
        "name": "Personal Savings",
        "newBalance": 3000000
      },
      "member": {
        "id": "member_id",
        "name": "Alice Smith"
      }
    }
  }
}
```

### Webhook Registration

To register a webhook endpoint, use the following API:

```
POST /webhooks
```

**Request Body:**

```json
{
  "url": "https://your-endpoint.com/webhook",
  "events": [
    "transaction.created",
    "account.balance.updated"
  ],
  "secret": "your_webhook_secret"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Webhook registered successfully",
  "webhook": {
    "id": "webhook_id",
    "url": "https://your-endpoint.com/webhook",
    "events": [
      "transaction.created",
      "account.balance.updated"
    ],
    "createdAt": "2025-03-02T10:00:00Z"
  }
}
```

## Versioning

The API is versioned and currently at v1. The version is specified in the URL path:

```
https://your-app-domain.com/api/v1/members
```

Future versions (v2, v3, etc.) will be deployed without breaking changes to existing endpoints.
