import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import GrayCloseIcon from '/icons/close-gray.svg';

import { AttendanceData, postNewAttendance } from '../apis/attendanceRequest';
import { useMutation } from '@tanstack/react-query';
import ErrorPopup from '@/components/ui/ErrorPopup';

interface CreateQRModalProps {
  closeFirstModalAndOpenSecond: () => void;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  numberOfPeople: number;
  setNumberOfPeople: React.Dispatch<React.SetStateAction<number>>;
  setAttendUrl: React.Dispatch<React.SetStateAction<string>>;
  setAttendanceId: React.Dispatch<React.SetStateAction<number>>;
}

export const CreateQRModal: React.FC<CreateQRModalProps> = ({
  closeFirstModalAndOpenSecond,
  title,
  setTitle,
  numberOfPeople,
  setNumberOfPeople,
  setAttendUrl,
  setAttendanceId,
}) => {
  const [error, setError] = useState<Error | null>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  const newAttendanceMutation = useMutation({
    mutationFn: (data: AttendanceData) => postNewAttendance(data),
    onSuccess: (data) => {
      setAttendUrl(data.data.attendUrl);
      setAttendanceId(data.data.attendanceId);
      //console.log('Attendance registered successfully:', data);
    },
    onError: (error: Error) => {
      setError(error);
      console.error('Error registering attendance:', error);
    },
  });

  //출석 QR 생성
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const attendanceData: AttendanceData = {
      title: title,
      batch: '25-26',
    };
    newAttendanceMutation.mutate(attendanceData);
    closeFirstModalAndOpenSecond();
  };

  return (
    <div>
      {error && <ErrorPopup />}
      <div className="fixed inset-0 bg-gray-800 bg-opacity-10 flex justify-center items-center">
        <div className="w-[70%] h-[100%] relative flex flex-col justify-center items-center bg-[#ffffff] p-4 rounded-[10px] filter drop-shadow-[0px_4px_10px_rgba(0,0,0,0.15)]">
          <h2 className="top-[78px] left-[60px] absolute font-['NanumSquareRoundEB'] text-[24px] font-extrabold">
            출석 QR 생성
          </h2>
          <form className="flex flex-col w-[400px] h-[422px] relative">
            <label
              htmlFor="title"
              className="mb-[18px] text-[#5C5353] font-Pretendard] text-[17px] font-[600] leading-[1.5] tracking-[0.17px]"
            >
              제목
            </label>
            <div className="relative w-full mb-[80px]">
              <Input
                id="title"
                className="w-[400px] h-[50px] rounded-[10px] border-[#DADADA] bg-[#F3F3F3] px-[12px] text-[16px] focus:border-[#b1b1b1]"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => {
                  borderRef.current?.style.setProperty(
                    'background-color',
                    '#b1b1b1',
                  );
                }}
                onBlur={() => {
                  borderRef.current?.style.setProperty(
                    'background-color',
                    '#b1b1b1',
                  );
                }}
              />
              <img
                src={GrayCloseIcon}
                alt="close"
                className="absolute right-4 top-[14px] cursor-pointer"
                onClick={() => setTitle('')}
              />
            </div>
            <label
              htmlFor="number"
              className="mb-[18px] text-[#5C5353] font-Pretendard] text-[17px] font-[600] leading-[1.5] tracking-[0.17px]"
            >
              총 인원 수
            </label>
            <div className="relative w-full">
              <Input
                disabled
                type="number"
                id="number"
                className="w-[400px] h-[50px] rounded-[10px] border-[#DADADA] bg-[#F3F3F3] px-[12px] text-[16px] focus:border-[#b1b1b1]"
                value={numberOfPeople.toString()}
                onChange={(e) => setNumberOfPeople(Number(e.target.value))}
                onFocus={() => {
                  borderRef.current?.style.setProperty(
                    'background-color',
                    '#b1b1b1',
                  );
                }}
                onBlur={() => {
                  borderRef.current?.style.setProperty(
                    'background-color',
                    '#b1b1b1',
                  );
                }}
              />
              <img
                src={GrayCloseIcon}
                alt="close"
                className="absolute right-4 top-[14px] cursor-pointer"
                onClick={() => setNumberOfPeople(0)}
              />
            </div>
            <Button
              onClick={(e) => handleSubmit(e)}
              className="absolute bottom-[0px] right-[0px] px-[28px] py-[14px]"
            >
              확인
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
