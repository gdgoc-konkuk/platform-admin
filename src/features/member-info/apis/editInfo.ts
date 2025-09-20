import { instance } from '@/lib/instance';
import { MemberInfo } from '@/features/member-info/types/member-info';
import { CURRENT_BATCH } from '@/lib/constants';

export function editInfo(info: MemberInfo) {
  return instance.patch(`/members/${CURRENT_BATCH}`, {
    memberUpdateInfoList: [info],
  });
}
