import { instance } from '@/lib/instance';
import { MemberInfo } from '../types/member-info';

export function editInfo(info: MemberInfo) {
  return instance.patch('/members/25-26', {
    memberUpdateInfoList: [info],
  });
}
