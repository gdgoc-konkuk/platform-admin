export interface MemberInfo {
  memberId: number;
  studentId: string;
  name: string;
  email: string;
  department: string;
  batch: string;
  role: string;
}

export interface ResponseData {
  message: string;
  data: MemberInfo[];
  success: boolean;
}

export type MemberFormData = Omit<MemberInfo, 'memberId'>;

export interface MemberList {
  members: Omit<MemberFormData, 'id' | 'isChecked'>[];
}