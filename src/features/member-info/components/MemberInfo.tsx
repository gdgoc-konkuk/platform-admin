import { useQuery } from '@tanstack/react-query';
import { getInfos } from '../apis/getInfos';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ResponseData } from '../types/member-info';
import { InfoEditDialog } from './InfoEditDialog';

export function MemberInfo() {
  const { data, error, isLoading } = useQuery<ResponseData>({
    queryKey: ['member-info'],
    queryFn: getInfos,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }

  return (
    <div className="h-full overflow-y-auto">
      <h1 className="mb-[2vh] font-['NanumSquareRoundEB'] text-[24px] font-extrabold ">
        멤버 정보
      </h1>
      <Table>
        <TableCaption>멤버 정보</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>학번</TableHead>
            <TableHead>이름</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>학부</TableHead>
            <TableHead>배치</TableHead>
            <TableHead>역할</TableHead>
            <TableHead>수정</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data.map((info) => (
            <TableRow key={info.memberId}>
              <TableCell>{info.studentId}</TableCell>
              <TableCell className="font-bold">{info.name}</TableCell>
              <TableCell>{info.email}</TableCell>
              <TableCell>{info.department}</TableCell>
              <TableCell>{info.batch}</TableCell>
              <TableCell>{info.role}</TableCell>
              <TableCell>
                <InfoEditDialog info={info} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
