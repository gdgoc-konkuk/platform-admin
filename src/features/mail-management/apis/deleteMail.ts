import { instance } from '@/lib/instance';

export function deleteMail(id: number) {
  return instance.delete(`/emails/${id}`);
}

export function deleteSentMail(ids: number[]) {
  return instance.delete(
    '/emails?' + ids.map((id) => `emailIds=${id}`).join('&'),
  );
}
