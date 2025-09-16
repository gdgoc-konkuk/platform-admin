import { useMutation, useQueryClient } from '@tanstack/react-query';
import { instance } from '@/lib/instance';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function InfoDeleteDialog({ memberId }: { memberId: number }) {
  const queryClient = useQueryClient();

  const deleteMemberMutation = useMutation({
    mutationFn: () => instance.delete(`/members/${memberId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-info'] });
      alert('삭제되었습니다!');
    },
    onError: (err: Error) => {
      alert(`삭제 실패: ${err.message}`);
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">
          삭제
        </Button>
      </DialogTrigger>
      <DialogContent className="font-pretendard bg-white px-8 py-11">
        <h3 className="text-lg font-bold">멤버 삭제</h3>
        <p>정말 이 멤버를 삭제하시겠습니까?</p>
        <div className="flex gap-2 mt-4">
          <Button
            variant="destructive"
            onClick={() => deleteMemberMutation.mutate()}
            disabled={deleteMemberMutation.isPending}
          >
            {deleteMemberMutation.isPending ? '삭제 중...' : '삭제'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
