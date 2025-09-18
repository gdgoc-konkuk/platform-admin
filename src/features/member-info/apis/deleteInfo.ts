import { CURRENT_BATCH } from '@/lib/constants';
import { instance } from '@/lib/instance';

export function deleteInfo(memberId: number) {
  return instance.delete(`/members/${CURRENT_BATCH}/${memberId}`);
}
