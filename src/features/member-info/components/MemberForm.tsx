import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BATCH_OPTIONS, ROLE_OPTIONS } from '@/lib/constants';
import { MemberFormData } from '@/features/member-info/types/member-info';

interface MemberFormProps {
  formData: MemberFormData;
  onFormChange: (
    e: React.ChangeEvent<HTMLInputElement> | { name: string; value: string },
  ) => void;
}

export function MemberForm({ formData, onFormChange }: MemberFormProps) {
  const handleSelectChange = (name: string, value: string) => {
    onFormChange({ name, value });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Label htmlFor="name">이름</Label>
        <Input
          id="name"
          name="name"
          placeholder="이름"
          value={formData.name}
          onChange={onFormChange}
          className="bg-gray-100"
        />
      </div>
      <div>
        <Label htmlFor="studentId">학번</Label>
        <Input
          id="studentId"
          name="studentId"
          placeholder="학번"
          value={formData.studentId}
          onChange={onFormChange}
          className="bg-gray-100"
        />
      </div>
      <div>
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={onFormChange}
          className="bg-gray-100"
        />
      </div>
      <div>
        <Label htmlFor="department">학과</Label>
        <Input
          id="department"
          name="department"
          placeholder="학과"
          value={formData.department}
          onChange={onFormChange}
          className="bg-gray-100"
        />
      </div>

      <div>
        <Label htmlFor="batch">기수</Label>
        <Select
          name="batch"
          value={formData.batch}
          onValueChange={(value) => handleSelectChange('batch', value)}
        >
          <SelectTrigger id="batch" className="w-full bg-gray-100">
            <SelectValue placeholder="기수를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {BATCH_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="role">역할</Label>
        <Select
          name="role"
          value={formData.role}
          onValueChange={(value) => handleSelectChange('role', value)}
        >
          <SelectTrigger id="role" className="w-full bg-gray-100">
            <SelectValue placeholder="역할을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
