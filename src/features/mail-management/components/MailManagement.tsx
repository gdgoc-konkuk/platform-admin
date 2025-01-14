import { Button } from '@/components/ui/button';
import PencilIcon from '/icons/pencil.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import CheckedIcon from '/icons/checked.svg';
import UncheckedIcon from '/icons/unchecked.svg';
import { Input } from '@/components/ui/input';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMailList } from '../apis/getMailList';
import { Mail, MailData } from '../types/mail';
import { useToast } from '@/components/ui/use-toast';
import { deleteMail, deleteSentMail } from '../apis/deleteMail';
import { translateDate } from '../lib/utils';

export default function MailManagement() {
  const naviagate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ['mails'],
    queryFn: getMailList,
  });
  const [mails, setMails] = useState<MailData[]>([]);
  const { mutateAsync } = useMutation({
    mutationFn: (id: number) => deleteMail(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mails'] });
      toast({
        title: '삭제 완료',
        description: '해당 메일을 삭제했습니다.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: '삭제 실패',
        description: '메일 삭제에 실패했습니다. 다시 시도해주세요.',
      });
    },
  });
  const { mutateAsync: mutateSentMail } = useMutation({
    mutationFn: (ids: number[]) => deleteSentMail(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mails'] });
      toast({
        title: '삭제 완료',
        description: '해당 메일을 삭제했습니다.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: '삭제 실패',
        description: '메일 삭제에 실패했습니다. 다시 시도해주세요.',
      });
    },
  });

  const onRemove = async () => {
    const checkedReservedMails = mails.filter(
      (mail) => mail.isChecked && !mail.isSent,
    );
    const checkedSentMails = mails.filter(
      (mail) => mail.isChecked && mail.isSent,
    );
    if (checkedReservedMails.length === 0 && checkedSentMails.length === 0) {
      toast({
        variant: 'destructive',
        title: '삭제 실패',
        description: '삭제할 메일을 선택해주세요.',
      });
      return;
    }

    await Promise.all(checkedReservedMails.map((mail) => mutateAsync(mail.id)));
    await mutateSentMail(checkedSentMails.map((mail) => mail.id));
  };

  useEffect(() => {
    setMails(
      data?.data.emailTasks.map((mail: Mail) => ({
        ...mail,
        isChecked: false,
      })),
    );
  }, [data?.data.emailTasks]);

  useEffect(() => {
    if (!mails || mails.length === 0) {
      setIsCheckedAll(false);
      return;
    }
    const isAllChecked = mails.every((mail) => {
      return mail.isChecked;
    });
    setIsCheckedAll(isAllChecked);
    if (!isAllChecked) {
      setIsCheckedAll(false);
    }
  }, [mails]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!mails) {
    return <div>메일이 없습니다.</div>;
  }

  return (
    <div className="flex h-full w-full flex-col">
      <h1 className="font-nanum text-[24px]">메일 전송 관리</h1>

      <div className="flex gap-4 mt-3 self-end">
        <Link to="/app/mail/create">
          <Button className="flex items-center h-[50px] w-[142px]">
            <img src={PencilIcon} alt="edit" className="w-5 h-5 mr-2" />
            <span>작성하기</span>
          </Button>
        </Link>
        <Button
          className="w-[86px] h-[50px] border border-primary bg-white px-[28px] py-[12px] text-primary hover:bg-[#EBEBEF]"
          onClick={onRemove}
        >
          삭제
        </Button>
      </div>

      <div className="flex flex-col border border-[#DADADA] rounded-[20px] w-full h-full mt-6 overflow-y-scroll scrollbar scrollbar-track-transparent scrollbar-thumb-[#DADADA]">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-white">
            <TableRow className="h-[60px] px-[34px] py-5">
              <TableHead>
                <Label htmlFor="check-all">
                  <img
                    src={isCheckedAll ? CheckedIcon : UncheckedIcon}
                    alt="check"
                    className="w-6 h-6 cursor-pointer"
                  />
                </Label>
                <Input
                  id="check-all"
                  type="checkbox"
                  checked={isCheckedAll}
                  onChange={(e) => {
                    setMails(
                      mails.map((mail) => ({
                        ...mail,
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
              <TableHead>예약 시간</TableHead>
              <TableHead>제목</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {mails.map((mail) => (
              <TableRow
                key={mail.id}
                className="h-[60px] px-[34px] py-5 cursor-pointer"
                onClick={(e) => {
                  if (
                    e.target instanceof HTMLElement &&
                    (e.target.closest('input[type="checkbox"]') ||
                      e.target.closest('label'))
                  )
                    return;
                  naviagate(`/app/mail/edit/${mail.id}`);
                }}
              >
                <TableCell>
                  <Label htmlFor={`check-${mail.id}`}>
                    <img
                      src={mail.isChecked ? CheckedIcon : UncheckedIcon}
                      alt="check"
                      className="w-6 h-6 cursor-pointer"
                    />
                  </Label>
                  <Input
                    id={`check-${mail.id}`}
                    type="checkbox"
                    checked={mail.isChecked}
                    onChange={(e) => {
                      setMails(
                        mails.map((m) =>
                          m.id === mail.id
                            ? { ...m, isChecked: e.target.checked }
                            : m,
                        ),
                      );
                    }}
                    className="hidden"
                  />
                </TableCell>
                <TableCell>{mail.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-4">
                    {mail.receiverInfos.map((receiver) => (
                      <span key={receiver.email}>{receiver.name}</span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-4">
                    {mail.receiverInfos.map((receiver) => (
                      <span key={receiver.email}>{receiver.email}</span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{translateDate(mail.sendAt)}</TableCell>
                <TableCell>{mail.subject}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
