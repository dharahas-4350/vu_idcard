export type CardTemplate = 'classic-blue' | 'modern-purple' | 'minimal-white' | 'premium-black' | 'university-green';

export type CardOrientation = 'vertical' | 'horizontal';

export type FontStyleOption = 'modern' | 'classic' | 'geometric';

export interface CardTheme {
  primaryColor: string;
  accentColor: string;
  secondaryColor: string;
}

export interface StudentData {
  _id?: string;
  name: string;
  rollNumber: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  photograph: string;
  collegeName: string;
  department: string;
  course: string;
  academicYear: string;
  semester: string;
  admissionYear: string;
  graduationYear: string;
  bloodGroup: string;
  collegeAddress: string;
  emergencyContact: string;
  studentType?: 'dayscholar' | 'hostler';
  fatherName?: string;
  section?: string;
  studentAddress?: string;
}

export interface IDCardRecord {
  _id: string;
  userId?: string;
  studentId?: string;
  studentData: StudentData;
  template: CardTemplate;
  theme: CardTheme;
  cardLayout: CardOrientation;
  fontStyle: FontStyleOption;
  collegeLogo: string;
  signatureText: string;
  verificationCode: string;
  qrPayload: string;
  status: 'Draft' | 'Generated' | 'Saved';
  cardValidity: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  collegeName?: string;
}

export interface VerificationResult {
  verified: boolean;
  verificationCode: string;
  studentName: string;
  rollNumber: string;
  collegeName: string;
  department: string;
  course: string;
  academicYear: string;
  semester: string;
  validity: string;
  photograph?: string;
  collegeLogo?: string;
  issuedAt: string;
  status: string;
}
