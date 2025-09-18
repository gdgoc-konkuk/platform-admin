import { instance } from '@/lib/instance';
import { MemberInfo } from '@/features/member-info/types/member-info';

export function addInfo(info: MemberInfo) {
  return instance.post('/members', info);
}