import { CURRENT_BATCH } from '@/lib/constants';
import { instance } from '@/lib/instance';

export async function getInfos() {
  const { data } = await instance.get(`/members/${CURRENT_BATCH}`);

  return data;
}
