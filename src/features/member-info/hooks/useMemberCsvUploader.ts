import { useState, useEffect, useCallback } from 'react';
import { ParseResult } from 'papaparse';
import {
  MemberFormData,
  MemberList,
} from '@/features/member-info/types/member-info';
import { z } from 'zod';
import { CsvData } from '@/types/CsvData';

const memberSchema = z.object({
  studentId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  department: z.string().min(1),
  batch: z.string().min(1),
  role: z.string().min(1),
});

export type MemberWithCheck = MemberFormData & { isChecked: boolean };

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
    (current: MemberWithCheck[], incoming: MemberFormData[]) => {
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
      const parsedMembers: MemberFormData[] = [];

      rows.forEach((row) => {
        if (row.length < 6) return;
        const candidate = {
          studentId: row[0],
          name: row[1],
          email: row[2],
          department: row[3],
          batch: row[4],
          role: row[5],
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

  const toggleMemberChecked = useCallback((studentId: string) => {
    setMembers((current) =>
      current.map((m) =>
        m.studentId === studentId ? { ...m, isChecked: !m.isChecked } : m,
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

  const clearUploadedFiles = () => {
    setUploadedFiles([]);
    setMembers([]);
  };

  return {
    members,
    uploadedFiles,
    isCheckedAll,
    handleOnUploadAccepted,
    handleRemoveUploadedFile,
    toggleMemberChecked,
    toggleAllChecked,
    removeSelectedMembers,
    clearUploadedFiles,
  };
};
