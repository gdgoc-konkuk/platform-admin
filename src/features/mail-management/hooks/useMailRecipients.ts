import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { UseFormSetValue } from 'react-hook-form';
import { ParseResult } from 'papaparse';
import { CreateMailFormFields } from '@/features/mail-management/lib/CreateMailFormSchema';
import { UploadedFile, User } from '@/features/mail-management/types/mail';

const receiverSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email format').trim(),
});

export const useMailRecipients = (
  setValue: UseFormSetValue<CreateMailFormFields>,
) => {
  const [users, setUsers] = useState<User[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);

  useEffect(() => {
    const recipientInfos = users.map(({ name, email }) => ({ name, email }));
    setValue('recieverInfos', recipientInfos, { shouldValidate: true });
  }, [users, setValue]);

  useEffect(() => {
    if (users.length > 0 && users.every((user) => user.isChecked)) {
      setIsCheckedAll(true);
    } else {
      setIsCheckedAll(false);
    }
  }, [users]);

  const mergeUsers = useCallback(
    (currentUsers: User[], newUsers: Omit<User, 'id' | 'isChecked'>[]) => {
      const combined = [...currentUsers];
      const userEmailSet = new Set(
        currentUsers.map((user) => user.email.toLowerCase()),
      );

      newUsers.forEach((newUser) => {
        if (!userEmailSet.has(newUser.email.toLowerCase())) {
          combined.push({ ...newUser, id: 0, isChecked: false });
          userEmailSet.add(newUser.email.toLowerCase());
        }
      });
      return combined.map((user, idx) => ({ ...user, id: idx + 1 }));
    },
    [],
  );

  const handleOnUploadAccepted = useCallback(
    (results: ParseResult<string[]>, file: File) => {
      const data = results.data;
      const parsedUsers = data
        .slice(1)
        .reduce<Omit<User, 'id' | 'isChecked'>[]>((acc, row) => {
          if (row.length >= 2 && row[0] && row[1]) {
            const candidate = { name: row[0].trim(), email: row[1].trim() };
            const parsed = receiverSchema.safeParse(candidate);
            if (parsed.success) {
              acc.push(parsed.data);
            }
          }
          return acc;
        }, []);

      if (parsedUsers.length === 0) return;

      setUploadedFiles((prev) => [
        ...prev,
        { file, id: prev.length + 1, users: parsedUsers },
      ]);

      setUsers((currentUsers) => mergeUsers(currentUsers, parsedUsers));
    },
    [mergeUsers],
  );

  const handleRemoveUploadedFile = useCallback(
    (fileId: number) => {
      let usersFromFileToRemove: Omit<User, 'id' | 'isChecked'>[] = [];
      const fileToRemove = uploadedFiles.find((f) => f.id === fileId);
      if (fileToRemove) {
        usersFromFileToRemove = fileToRemove.users;
      }
      const usersFromFileToRemoveSet = new Set(
        usersFromFileToRemove.map((u) => u.email.toLowerCase()),
      );

      setUsers((currentUsers) => {
        const remainingUsers = currentUsers.filter(
          (u) => !usersFromFileToRemoveSet.has(u.email.toLowerCase()),
        );
        return remainingUsers.map((user, index) => ({
          ...user,
          id: index + 1,
        }));
      });

      setUploadedFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileId));
    },
    [uploadedFiles],
  );

  const addRecipient = useCallback(
    (name: string, email: string) => {
      if (!name || !email) return false;
      const parsed = receiverSchema.safeParse({ name, email });
      if (!parsed.success) return false;

      const newUser = parsed.data;
      setUsers((currentUsers) => mergeUsers(currentUsers, [newUser]));
      return true;
    },
    [mergeUsers],
  );

  const removeSelectedRecipients = useCallback(() => {
    const remainingUsers = users.filter((user) => !user.isChecked);
    setUsers(remainingUsers.map((user, index) => ({ ...user, id: index + 1 })));
  }, [users]);

  const toggleUserChecked = useCallback((userId: number) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId ? { ...user, isChecked: !user.isChecked } : user,
      ),
    );
  }, []);

  const toggleAllChecked = useCallback((checked: boolean) => {
    setIsCheckedAll(checked);
    setUsers((currentUsers) =>
      currentUsers.map((user) => ({ ...user, isChecked: checked })),
    );
  }, []);

  return {
    users,
    setUsers,
    uploadedFiles,
    setUploadedFiles,
    isCheckedAll,
    handleOnUploadAccepted,
    handleRemoveUploadedFile,
    addRecipient,
    removeSelectedRecipients,
    toggleUserChecked,
    toggleAllChecked,
  };
};