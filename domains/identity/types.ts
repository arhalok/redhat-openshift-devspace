/**
 * Identity and Multi-Tenant Domain Types
 * Sections 7 & 34 of logistics-foundation.md
 */

export type OrganizationType = 'COMPANY' | 'DISTRIBUTOR' | 'SUPPLIER' | 'OPERATOR' | 'ADMIN';

export type UserRole =
  | 'OWNER'
  | 'ADMIN'
  | 'OPERATIONS_MANAGER'
  | 'DISPATCHER'
  | 'PROCUREMENT_MANAGER'
  | 'STORE_OWNER'
  | 'SUPPLIER_USER'
  | 'VIEWER';

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  type: OrganizationType;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  organizationId: string;
  role: UserRole;
  createdAt: string;
}
