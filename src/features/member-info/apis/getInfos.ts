import { instance } from '@/lib/instance';

export async function getInfos() {
  const { data } = await instance.get('/members/25-26');

  return data;
}
