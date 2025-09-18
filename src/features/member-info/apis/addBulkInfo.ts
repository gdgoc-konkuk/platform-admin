import { instance } from '@/lib/instance';
import { MemberInfo } from '@/features/member-info/types/member-info';

export function bulkAddInfo(infos: MemberInfo[]) {
  return instance.post('/members/bulk', infos);
}
