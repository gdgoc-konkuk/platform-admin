import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MemberInfo } from '../types/member-info';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { editInfo } from '../apis/editInfo';

interface InfoEditDialogProps {
  info: MemberInfo;
}

export function InfoEditDialog({ info }: InfoEditDialogProps) {
  const [studentId, setStudentId] = useState(info.studentId);
  const [name, setName] = useState(info.name);
  const [email, setEmail] = useState(info.email);
  const [department, setDepartment] = useState(info.department);
  const [batch, setBatch] = useState(info.batch);
  const [role, setRole] = useState(info.role);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () =>
      editInfo({
        memberId: info.memberId,
        studentId,
        name,
        email,
        department,
        batch,
        role,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-info'] });
      toast({
        title: '수정 완료',
        description: '멤버 정보를 수정했습니다.',
      });
      setIsOpen(false);
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: '수정 실패',
        description: '멤버 정보 수정에 실패했습니다. 다시 시도해주세요.',
      });
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      studentId === '' ||
      name === '' ||
      email === '' ||
      department === '' ||
      batch === '' ||
      role === ''
    ) {
      setError('모든 정보를 입력해주세요.');
      return;
    }

    mutateAsync();
  };

  useEffect(() => {
    setError('');
  }, [studentId, name, email, department, batch, role]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>수정</Button>
      </DialogTrigger>
      <DialogContent className="font-pretendard bg-white px-8 py-11">
        <DialogHeader>
          <DialogTitle>멤버 정보 수정</DialogTitle>
          <DialogDescription>멤버 정보를 수정할 수 있습니다.</DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="studentId">학번</Label>
            <Input
              id="studentId"
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="bg-gray-100"
            />
          </div>

          <div>
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-100"
            />
          </div>

          <div>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-100"
            />
          </div>

          <div>
            <Label htmlFor="department">학과</Label>
            <Input
              id="department"
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="bg-gray-100"
            />
          </div>

          <div>
            <Label htmlFor="batch">배치</Label>
            <Input
              id="batch"
              type="text"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="bg-gray-100"
            />
          </div>

          <div>
            <Label htmlFor="role">역할</Label>
            <Input
              id="role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-gray-100"
            />
          </div>
          <div className="flex justify-end items-center gap-4">
            <p className="text-red-500">{error}</p>
            <Button type="submit" disabled={isPending}>
              {isPending ? '수정 중...' : '수정'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
