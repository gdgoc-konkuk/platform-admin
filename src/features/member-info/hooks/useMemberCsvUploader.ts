import { useState, useEffect, useCallback } from 'react';
import { ParseResult } from 'papaparse';
import {
  MemberInfo,
  MemberList,
} from '@/features/member-info/types/member-info';
import { z } from 'zod';
import { CsvData } from '@/types/CsvData';

const memberSchema = z.object({
  memberId: z.coerce.number(),
  studentId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  department: z.string().min(1),
  batch: z.string().min(1),
  role: z.string().min(1),
});

export type MemberWithCheck = MemberInfo & { isChecked: boolean };

export const useMemberCsvUploader = () => {
  const [members, setMembers] = useState<MemberWithCheck[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<
    CsvData<MemberList>[]
  >([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);

  useEffect(() => {
    if (members.length > 0 && members.every((m) => m.isChecked)) {
      setIsCheckedAll(true);
    } else {
      setIsCheckedAll(false);
    }
  }, [members]);

  const mergeMembers = useCallback(
    (
      current: MemberWithCheck[],
      incoming: MemberInfo[],
    ) => {
      const set = new Set(current.map((m) => m.studentId));
      const combined = [...current];
      incoming.forEach((m) => {
        if (!set.has(m.studentId)) {
          combined.push({ ...m, isChecked: false });
          set.add(m.studentId);
        }
      });
      return combined.map((m, idx) => ({ ...m, id: idx + 1 }));
    },
    [],
  );

  const handleOnUploadAccepted = useCallback(
    (results: ParseResult<string[]>, file: File) => {
      const [, ...rows] = results.data;
      const parsedMembers: MemberInfo[] = [];

      rows.forEach((row) => {
        if (row.length < 7) return;
        const candidate = {
          memberId: Number(row[0]),
          studentId: row[1],
          name: row[2],
          email: row[3],
          department: row[4],
          batch: row[5],
          role: row[6],
        };
        const parsed = memberSchema.safeParse(candidate);
        if (parsed.success) {
          parsedMembers.push(parsed.data);
        }
      });

      if (parsedMembers.length === 0) {
        throw new Error('CSV 형식이 올바르지 않거나 유효한 데이터가 없습니다.');
      }

      setUploadedFiles((prev) => [
        ...prev,
        { id: prev.length + 1, file, data: { members: parsedMembers } },
      ]);
      
      setMembers((current) => mergeMembers(current, parsedMembers));
    },
    [mergeMembers],
  );

  const handleRemoveUploadedFile = useCallback(
    (fileId: number) => {
      const file = uploadedFiles.find((f) => f.id === fileId);
      if (!file) return;

      const removeSet = new Set(file.data.members.map((m) => m.studentId));
      setMembers((current) =>
        current.filter((m) => !removeSet.has(m.studentId)),
      );
      setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    },
    [uploadedFiles],
  );

  const toggleMemberChecked = useCallback((memberId: number) => {
    setMembers((current) =>
      current.map((m) =>
        m.memberId === memberId
          ? { ...m, isChecked: !m.isChecked }
          : m,
      ),
    );
  }, []);

  const toggleAllChecked = useCallback((checked: boolean) => {
    setIsCheckedAll(checked);
    setMembers((current) => current.map((m) => ({ ...m, isChecked: checked })));
  }, []);

  const removeSelectedMembers = useCallback(() => {
    setMembers((current) => current.filter((m) => !m.isChecked));
  }, []);

  return {
    members,
    uploadedFiles,
    isCheckedAll,
    handleOnUploadAccepted,
    handleRemoveUploadedFile,
    toggleMemberChecked,
    toggleAllChecked,
    removeSelectedMembers,
  };
};
