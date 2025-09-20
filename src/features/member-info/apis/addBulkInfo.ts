import { instance } from '@/lib/instance';
import { MemberFormData } from '@/features/member-info/types/member-info';

export function bulkAddInfo(infos: MemberFormData[]) {
  return instance.post('/members/bulk', infos);
}
