import { MemberInfo } from '@/features/member-info/types/member-info';

export const mockMembers: MemberInfo[] = [
  {
    memberId: 1,
    studentId: '20210001',
    name: '김개발',
    email: 'dev.kim@example.com',
    department: '소프트웨어학부',
    batch: '25-26',
    role: 'ROLE_CORE',
  },
  {
    memberId: 2,
    studentId: '20220002',
    name: '이코딩',
    email: 'coding.lee@example.com',
    department: '컴퓨터공학과',
    batch: '25-26',
    role: 'ROLE_CORE',
  },
];
