import { Button } from '@/components/ui/button';
import DateTimePicker from '@/components/ui/DateTimePicker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import CheckedIcon from '/icons/checked.svg';
import UncheckedIcon from '/icons/unchecked.svg';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import BlackCloseIcon from '/icons/close-black.svg';
import GrayCloseIcon from '/icons/close-gray.svg';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateMailFormFields,
  CreateMailFormSchema,
} from '@/features/mail-management/lib/CreateMailFormSchema';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { editMail } from '@/features/mail-management/apis/editMail';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getMail } from '@/features/mail-management/apis/getMail';

interface User {
  id: number;
  name: string;
  email: string;
  isChecked: boolean;
}

export default function EditMail() {
  const [users, setUsers] = useState<User[]>([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [nameCloseHovered, setNameCloseHovered] = useState(false);
  const [titleCloseHovered, setTitleCloseHovered] = useState(false);
  const [emailCloseHovered, setEmailCloseHovered] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['mail', id],
    queryFn: () => getMail(Number(id)),
  });

  const methods = useForm<CreateMailFormFields>({
    resolver: zodResolver(CreateMailFormSchema),
    defaultValues: {
      subject: '',
      recieverInfos: [],
      date: format(new Date(), 'yyyy-MM-dd'),
      hour: '00',
      minute: '00',
      content: '',
    },
  });

  const addReciever = () => {
    if (!name || !email) return;
    methods.setValue('recieverInfos', [
      ...methods.watch('recieverInfos'),
      { name, email },
    ]);
    setUsers([
      ...users,
      { id: users.length + 1, name, email, isChecked: false },
    ]);
    setName('');
    setEmail('');
  };

  const removeReciever = () => {
    const filteredUsers = users.filter((user) => user.isChecked === false);
    const reindexedUsers = filteredUsers.map((user, index) => ({
      ...user,
      id: index + 1,
    }));

    setUsers(reindexedUsers);
    methods.setValue(
      'recieverInfos',
      reindexedUsers.map((user) => ({ name: user.name, email: user.email })),
    );
  };

  const { mutateAsync } = useMutation({
    mutationFn: (formData: CreateMailFormFields) =>
      editMail(formData, Number(id)),
    onSuccess: () => {
      toast({
        title: '메일 수정 완료',
        description: '메일을 성공적으로 수정했습니다.',
      });
      queryClient.invalidateQueries({ queryKey: ['mails'] });
      navigate('/app/mail');
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: '메일 수정 실패',
        description: '메일 수정에 실패했습니다. 다시 시도해주세요.',
      });
    },
  });

  const onSubmit: SubmitHandler<CreateMailFormFields> = async (formData) => {
    console.log(formData);
    await mutateAsync(formData);
  };

  useEffect(() => {
    users.find((user) => user.isChecked === false) || users.length === 0
      ? setIsCheckedAll(false)
      : setIsCheckedAll(true);
  }, [users]);

  useEffect(() => {
    const mailData = data?.data;
    if (!mailData) return;
    methods.setValue('subject', mailData.subject);
    methods.setValue('content', mailData.content);
    methods.setValue('date', mailData.sendAt.split('T')[0]);
    methods.setValue('hour', mailData.sendAt.split('T')[1].split(':')[0]);
    methods.setValue('minute', mailData.sendAt.split('T')[1].split(':')[1]);
    methods.setValue('recieverInfos', mailData.receiverInfos);
    setUsers(
      mailData.receiverInfos.map(
        (info: { name: string; email: string }, index: number) => ({
          id: index + 1,
          name: info.name,
          email: info.email,
          isChecked: false,
        }),
      ),
    );
  }, [data, methods]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <FormProvider {...methods}>
      <form
        className="flex h-full w-full flex-col overflow-y-scroll scrollbar-hide"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <h1 className="font-nanum text-[24px]">메일 전송 관리</h1>

        <Button className="h-[50px] w-[86px] self-end px-[28px] py-3 text-white">
          저장
        </Button>

        <h1 className="mt-[70px] text-[18px] font-semibold text-[#171719]">
          예약 시간
        </h1>

        <DateTimePicker
          title=""
          className="mt-[18px]"
          calendar={
            <Controller
              name="date"
              control={methods.control}
              render={({ field }) => (
                <Calendar
                  mode="single"
                  selected={new Date(field.value)}
                  onDayClick={(day) => {
                    methods.setValue('date', format(day, 'yyyy-MM-dd'));
                  }}
                  initialFocus
                  fromDate={new Date()}
                />
              )}
            />
          }
          date={methods.watch('date')}
          hour={methods.watch('hour')}
          setHour={(value) => methods.setValue('hour', value)}
          minute={methods.watch('minute')}
          setMinute={(value) => methods.setValue('minute', value)}
        />
        <p className="text-sm text-red-500">
          {methods.formState.errors.date?.message ||
            methods.formState.errors.hour?.message ||
            methods.formState.errors.minute?.message ||
            ''}
        </p>

        <div className="mt-[46px] flex w-full flex-col gap-[18px]">
          <Label
            htmlFor="subject"
            className="text-[18px] font-semibold text-[#171719]"
          >
            제목
          </Label>
          <div className="flex items-end gap-[6px]">
            <div className="relative w-1/3">
              <Input
                id="subject"
                {...methods.register('subject')}
                maxLength={30}
                className="h-[44px] rounded-[10px] border border-[#DADADA] bg-white px-[21px] py-[20px] text-[18px] text-[#171719]"
              />
              <img
                src={titleCloseHovered ? BlackCloseIcon : GrayCloseIcon}
                alt="close"
                className="absolute right-4 top-[10px] cursor-pointer"
                onMouseEnter={() => setTitleCloseHovered(true)}
                onMouseLeave={() => setTitleCloseHovered(false)}
                onClick={() => methods.setValue('subject', '')}
              />
            </div>
            <span
              className={cn(
                'text-[14px] text-[#BEBEBF]',
                methods.watch('subject').length >= 30 && 'text-[#EA4335]',
              )}
            >{`${methods.watch('subject').length}/30`}</span>
          </div>
          {methods.formState.errors.subject && (
            <p className="text-sm text-red-500">
              {methods.formState.errors.subject.message}
            </p>
          )}

          <div className="flex flex-col gap-5 mt-[46px]">
            <div className="flex gap-6">
              <div className="flex flex-col gap-[18px]">
                <Label
                  htmlFor="name"
                  className="text-[18px] font-semibold text-[#171719]"
                >
                  이름
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    className="h-[44px] w-[191px] rounded-[10px] border border-[#DADADA] bg-white px-[21px] py-[20px] text-[18px] text-[#171719] pr-12"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <img
                    src={nameCloseHovered ? BlackCloseIcon : GrayCloseIcon}
                    alt="close"
                    className="absolute right-4 top-[10px] cursor-pointer"
                    onMouseEnter={() => setNameCloseHovered(true)}
                    onMouseLeave={() => setNameCloseHovered(false)}
                    onClick={() => setName('')}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-[18px]">
                <Label
                  htmlFor="email"
                  className="text-[18px] font-semibold text-[#171719]"
                >
                  이메일
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    className="h-[44px] w-[317px] rounded-[10px] border border-[#DADADA] bg-white px-[21px] py-[20px] text-[18px] text-[#171719] pr-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <img
                    src={emailCloseHovered ? BlackCloseIcon : GrayCloseIcon}
                    alt="close"
                    className="absolute right-4 top-[10px] cursor-pointer"
                    onMouseEnter={() => setEmailCloseHovered(true)}
                    onMouseLeave={() => setEmailCloseHovered(false)}
                    onClick={() => setEmail('')}
                  />
                </div>
              </div>
              <div className="flex gap-[14px] self-end">
                <Button onClick={addReciever} type="button">
                  추가
                </Button>
                <Button onClick={removeReciever} type="button">
                  삭제
                </Button>
              </div>
            </div>

            <div className="mt-6 flex h-[400px] overflow-y-scroll w-full flex-col rounded-[20px] border border-[#DADADA] scrollbar scrollbar-thumb-[#DADADA] scrollbar-track-transparent">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-white">
                  <TableRow className="h-[60px] px-[34px] py-5">
                    <TableHead>
                      <Label htmlFor="check-all">
                        <img
                          src={isCheckedAll ? CheckedIcon : UncheckedIcon}
                          alt="check"
                          className="h-6 w-6 cursor-pointer"
                        />
                      </Label>
                      <Input
                        id="check-all"
                        type="checkbox"
                        checked={isCheckedAll}
                        onChange={(e) => {
                          setUsers(
                            users.map((user) => ({
                              ...user,
                              isChecked: e.target.checked,
                            })),
                          );
                          setIsCheckedAll(e.target.checked);
                        }}
                        className="hidden"
                      />
                    </TableHead>
                    <TableHead>No</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>이메일</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="h-[60px] px-[34px] py-5">
                      <TableCell>
                        <Label htmlFor={`check-${user.id}`}>
                          <img
                            src={user.isChecked ? CheckedIcon : UncheckedIcon}
                            alt="check"
                            className="h-6 w-6 cursor-pointer"
                          />
                        </Label>
                        <Input
                          id={`check-${user.id}`}
                          type="checkbox"
                          checked={user.isChecked}
                          onChange={(e) => {
                            setUsers((prev) =>
                              prev.map((prevUser) =>
                                prevUser.id === user.id
                                  ? { ...prevUser, isChecked: e.target.checked }
                                  : prevUser,
                              ),
                            );
                          }}
                          className="hidden"
                        />
                      </TableCell>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {methods.formState.errors.recieverInfos && (
              <p className="text-sm text-red-500">
                이름 또는 이메일 형식이 올바르지 않은 사람이 존재합니다.
              </p>
            )}
          </div>
          <Textarea
            {...methods.register('content')}
            className="mt-[38px] h-[500px] w-full rounded-[10px] border border-[#DADADA] bg-white px-[21px] py-[20px] text-[18px] text-[#171719] focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="내용을 입력해주세요."
          />
          {methods.formState.errors.content && (
            <p className="text-sm text-red-500">
              {methods.formState.errors.content.message}
            </p>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
