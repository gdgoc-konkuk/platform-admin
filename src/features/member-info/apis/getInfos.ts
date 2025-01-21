import { instance } from '@/lib/instance';

export async function getInfos() {
  const { data } = await instance.get('/members/24-25');

  return data;
}
