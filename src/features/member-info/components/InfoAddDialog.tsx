import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { instance } from '@/lib/instance';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export function InfoAddDialog() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    studentId: '',
    email: '',
    department: '',
    batch: '',
    role: '',
  });

  const addMemberMutation = useMutation({
    mutationFn: () =>
      instance.post('/members/25-26', { memberAddInfoList: [form] }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-info'] });
      toast({ title: '멤버가 추가되었습니다!' });
      setIsOpen(false);
      setForm({
        name: '',
        studentId: '',
        email: '',
        department: '',
        batch: '',
        role: '',
      });
    },
    onError: (err: Error) => {
      toast({ title: `멤버 추가 실패: ${err.message}`, variant: 'destructive' });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (error) {
      setError('');
    }
  }, [error, form]);

  const handleSubmit = () => {
    if (
      !form.name.trim() ||
      !form.studentId.trim() ||
      !form.email.trim() ||
      !form.department.trim() ||
      !form.batch.trim() ||
      !form.role.trim()
    ) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    addMemberMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>멤버 추가</Button>
      </DialogTrigger>
      <DialogContent className="font-pretendard bg-white px-8 py-11">
        <DialogHeader>
          <DialogTitle>멤버 추가</DialogTitle>
          <DialogDescription>
            멤버 정보를 입력하여 직접 추가할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col gap-6"
        >
          <div>
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              name="name"
              placeholder="이름"
              value={form.name}
              onChange={handleChange}
              className="bg-gray-100"
            />
          </div>
          <div>
            <Label htmlFor="studentId">학번</Label>
            <Input
              id="studentId"
              name="studentId"
              placeholder="학번"
              value={form.studentId}
              onChange={handleChange}
              className="bg-gray-100"
            />
          </div>
          <div>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              name="email"
              placeholder="이메일"
              value={form.email}
              onChange={handleChange}
              className="bg-gray-100"
            />
          </div>
          <div>
            <Label htmlFor="department">학과</Label>
            <Input
              id="department"
              name="department"
              placeholder="학과"
              value={form.department}
              onChange={handleChange}
              className="bg-gray-100"
            />
          </div>
          <div>
            <Label htmlFor="batch">기수</Label>
            <Input
              id="batch"
              name="batch"
              placeholder="기수"
              value={form.batch}
              onChange={handleChange}
              className="bg-gray-100"
            />
          </div>
          <div>
            <Label htmlFor="role">역할</Label>
            <Input
              id="role"
              name="role"
              placeholder="역할"
              value={form.role}
              onChange={handleChange}
              className="bg-gray-100"
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <div className="flex justify-end">
            <Button type="submit" disabled={addMemberMutation.isPending}>
              {addMemberMutation.isPending ? '추가 중...' : '추가'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
