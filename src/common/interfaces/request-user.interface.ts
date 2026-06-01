export interface RequestUser {
  id: string;
  email: string;
  roles: string[];
  companyId?: string | null;
}
