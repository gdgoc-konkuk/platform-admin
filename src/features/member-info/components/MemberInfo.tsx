import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CsvUploader } from '@/components/ui/CsvUploader';
import { getInfos } from '@/features/member-info/apis/getInfos';
import { useMemberCsvUploader } from '@/features/member-info/hooks/useMemberCsvUploader';
import { InfoActionDialog } from '@/features/member-info/components/InfoActionDialog';
import { InfoDeleteDialog } from '@/features/member-info/components/InfoDeleteDialog';
import { type MemberInfo, ResponseData } from '@/features/member-info/types/member-info';
import { bulkAddInfo } from '@/features/member-info/apis/addBulkInfo';

export function MemberInfo() {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<ResponseData>({
    queryKey: ['member-info'],
    queryFn: getInfos,
  });

  const {
    members,
    uploadedFiles,
    isCheckedAll,
    handleOnUploadAccepted,
    handleRemoveUploadedFile,
    toggleMemberChecked,
    toggleAllChecked,
    removeSelectedMembers,
    clearUploadedFiles,
  } = useMemberCsvUploader();

  const addMembersMutation = useMutation({
    mutationFn: bulkAddInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-info'] });
      removeSelectedMembers();
      clearUploadedFiles();
      alert('성공적으로 추가되었습니다!');
    },
    onError: (err) => {
  
      alert(`멤버 추가에 실패했습니다: ${err.message}`);
    },
  });

  const handleAddMembers = () => {
    const selectedMembers = members
      .filter((m) => m.isChecked)
      .map(({...rest }) => rest);

    if (selectedMembers.length === 0) {
      alert('추가할 멤버를 선택해주세요.');
      return;
    }

    addMembersMutation.mutate(selectedMembers);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }

  const selectedCount = members.filter((m) => m.isChecked).length;

  return (
    <div className="h-full overflow-y-auto p-4">
      <h1 className="mb-4 font-['NanumSquareRoundEB'] text-2xl font-extrabold">
        멤버 정보
      </h1>
      <CsvUploader
        uploadedFiles={uploadedFiles}
        onUploadAccepted={handleOnUploadAccepted}
        onUploadError={() =>
          alert('CSV 파싱에 실패했습니다. 파일 형식을 확인해주세요.')
        }
        onRemoveFile={handleRemoveUploadedFile}
        exampleFileUrl="/csvs/member_example.csv"
        exampleFileName="member_add_example.csv"
      />
      {members.length > 0 && (
        <div className="mt-8 border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">
              추가 예정 멤버 ({selectedCount} / {members.length} 선택)
            </h3>
            <Button
              onClick={handleAddMembers}
              disabled={selectedCount === 0 || addMembersMutation.isPending}
            >
              {addMembersMutation.isPending
                ? '추가하는 중...'
                : '선택한 멤버 추가'}
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <input
                    type="checkbox"
                    checked={isCheckedAll}
                    onChange={(e) => toggleAllChecked(e.target.checked)}
                    aria-label="Select all members"
                  />
                </TableHead>
                <TableHead>이름</TableHead>
                <TableHead>학번</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>학과</TableHead>
                <TableHead>기수</TableHead>
                <TableHead>역할</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.studentId}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={member.isChecked}
                      onChange={() => toggleMemberChecked(member.memberId)}
                    />
                  </TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.studentId}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.department}</TableCell>
                  <TableCell>{member.batch}</TableCell>
                  <TableCell>{member.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <div className="mt-8">
        <InfoActionDialog mode="add" trigger={<Button>멤버 추가</Button>} />
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">현재 멤버 목록</h2>
        <Table>
          <TableCaption>멤버 정보</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>학번</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>학부</TableHead>
              <TableHead>기수</TableHead>
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
                  <div className="flex gap-2">
                    <InfoActionDialog
                      mode="edit"
                      memberInfo={info}
                      trigger={<Button>수정</Button>}
                    />
                    <InfoDeleteDialog memberId={info.memberId} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}