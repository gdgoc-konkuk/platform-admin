import { instance } from '@/lib/instance';

export function deleteInfo(memberId: number) {
  return instance.delete(`/members/25-26/${memberId}`);
}
