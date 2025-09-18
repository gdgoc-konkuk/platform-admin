import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { instance } from '@/lib/instance';
import { MemberFormData, MemberInfo } from '@/features/member-info/types/member-info';

interface UseMemberFormProps {
  mode: 'add' | 'edit';
  initialData?: MemberInfo;
  onSuccess?: () => void;
}

const EMPTY_FORM: MemberFormData = {
  name: '',
  studentId: '',
  email: '',
  department: '',
  batch: '',
  role: '',
};

export function useMemberForm({
  mode,
  initialData,
  onSuccess,
}: UseMemberFormProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [formData, setFormData] = useState<MemberFormData>(
    initialData || EMPTY_FORM,
  );
  const [error, setError] = useState('');

  const mutationFn =
    mode === 'add'
      ? () => instance.post('/members/25-26', { memberAddInfoList: [formData] })
      : () => instance.put(`/members/${initialData?.memberId}`, formData);

  const { mutate, isPending } = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-info'] });
      toast({
        title: `멤버가 성공적으로 ${mode === 'add' ? '추가' : '수정'}되었습니다!`,
      });
      if (onSuccess) onSuccess();
      if (mode === 'add') setFormData(EMPTY_FORM);
    },
    onError: (err: Error) => {
      toast({
        title: `오류: ${err.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement> | { name: string; value: string },
  ) => {
    const { name, value } = 'target' in e ? e.target : e;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      Object.values(formData).some(
        (value) => typeof value !== 'string' || !value.trim(),
      )
    ) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    mutate();
  };

  useEffect(() => {
    setError('');
  }, [formData]);

  return {
    formData,
    error,
    isPending,
    handleFormChange,
    handleSubmit,
  };
}
