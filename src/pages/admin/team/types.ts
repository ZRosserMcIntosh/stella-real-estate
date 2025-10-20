export type PersonStatus = 'active' | 'inactive' | 'onboarding' | 'offboarding'
export type EmploymentType = 'employee' | 'executive' | 'third_party' | 'intern'
export type Department = 'Sales' | 'Operations' | 'Marketing' | 'Legal' | 'Accounting' | 'Analytics' | 'Admin' | string

export type Person = {
  id: string
  fullName: string
  socialName?: string
  preferredName?: string
  email: string
  phones?: string[]
  roleTitle: string
  department: Department
  city: string
  status: PersonStatus
  managerId?: string
  type: EmploymentType
  vendorName?: string
  directReports?: number
  tags?: string[]
}

export type OrgChartView = 'tree' | 'matrix' | 'geo' | 'vendor'
