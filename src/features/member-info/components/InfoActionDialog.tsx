import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MemberForm } from '@/features/member-info/components/MemberForm';
import { MemberInfo } from '@/features/member-info/types/member-info';
import { useMemberForm } from '@/features/member-info/hooks/useMemberForm';

interface MemberActionDialogProps {
  mode: 'add' | 'edit';
  trigger: React.ReactNode;
  memberInfo?: MemberInfo;
}

export function InfoActionDialog({
  mode,
  trigger,
  memberInfo,
}: MemberActionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { formData, error, isPending, handleFormChange, handleSubmit } =
    useMemberForm({
      mode,
      initialData: memberInfo,
      onSuccess: () => setIsOpen(false),
    });

  const title = mode === 'add' ? '멤버 추가' : '멤버 정보 수정';
  const description =
    mode === 'add'
      ? '멤버 정보를 입력하여 직접 추가할 수 있습니다.'
      : '멤버 정보를 수정할 수 있습니다.';
  const buttonText = mode === 'add' ? '추가' : '수정';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="font-pretendard bg-white px-8 py-11">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <MemberForm formData={formData} onFormChange={handleFormChange} />
          {error && <p className="text-destructive text-sm mt-4">{error}</p>}
          <div className="flex justify-end mt-6">
            <Button type="submit" disabled={isPending}>
              {isPending ? `${buttonText} 중...` : buttonText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
