import { instance } from '@/lib/instance';
import { MemberFormData } from '@/features/member-info/types/member-info';

export function addInfo(info: MemberFormData) {
  return instance.post('/members', info);
}