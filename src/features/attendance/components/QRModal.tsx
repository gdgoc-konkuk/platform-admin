import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

import dayjs from 'dayjs';

import QRCode from './LogoQRcode';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  deleteAttendance,
  deleteAttendanceQR,
  getAttendancesStatus,
} from '../apis/attendanceRequest';
import ErrorPopup from '@/components/ui/ErrorPopup';

interface QRModalProps {
  title: string;
  selectedDate: dayjs.Dayjs;
  closeSecondModal: () => void;
  attendanceId: number;
  attendUrl: string;
  refetch: () => void;
}
interface IAttendancesStatus {
  attendanceId: number;
  total: number;
  attended: number;
}

export const QRModal: React.FC<QRModalProps> = ({
  title,
  selectedDate,
  closeSecondModal,
  attendanceId,
  attendUrl,
  refetch,
}) => {
  const [error, setError] = useState<Error | null>(null);

  //출석 삭제 (attendanceID 삭제)
  const deleteAttendanceMutation = useMutation({
    mutationFn: (attendanceId: number) => deleteAttendance(attendanceId),
    onSuccess: () => {
      //console.log('Attendance deleted successfully:', data);
      refetch();
    },
    onError: (error: Error) => {
      setError(error);
      console.error('Error deleting attendance:', error);
    },
  });

  //QR 만료(출석 종료)
  const deleteQRMutation = useMutation({
    mutationFn: (attendanceId: number) => deleteAttendanceQR(attendanceId),
    onSuccess: () => {
      //console.log('QR deleted successfully:', data);
      refetch();
    },
    onError: (error: Error) => {
      setError(error);
      console.error('Error deleting QR:', error);
    },
  });

  //출석 현황 받아오기(3초)
  const { data: attendancesStatus } = useQuery<IAttendancesStatus>({
    queryKey: ['attendancesStatus', attendanceId],
    queryFn: () => getAttendancesStatus(attendanceId),
    refetchInterval: 3000, // 3초마다 refetch
  });

  const handleDeleteAttendance = (attendanceId: number) => {
    deleteAttendanceMutation.mutate(attendanceId);
    closeSecondModal();
  };
  const handleCloseQr = (attendanceId: number) => {
    deleteQRMutation.mutate(attendanceId);
    closeSecondModal();
  };

  return (
    <div>
      {error && <ErrorPopup />}

      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="w-[794px] h-[500px] flex flex-row gap-[86px] justify-center items-center bg-[#ffffff] p-4 rounded-[25px] filter drop-shadow-[0px_4px_10px_rgba(0,0,0,0.15)]">
          <div className="bg-[#d4d4d4] rounded-[25px]">
            <QRCode attendUrl={attendUrl} />
          </div>
          <div className="w-[188px] h-[330px] pt-[54px] flex flex-col justify-start items-center">
            <h1 className="text-[30px] mb-[20px] font-pretendard text-[#171719] font-[700]">
              {title}
            </h1>
            <p className="text-[18px] mb-[50px] font-pretendard text-[#535355] font-[400] leading-[20px] tracking-[0.18px]">
              {selectedDate.format('YYYY.MM.DD')}
            </p>

            <p className="text-[#333335] mb-[66px] font-pretendard text-[24px] font-semibold leading-[36px]">{`${attendancesStatus?.attended}/${attendancesStatus?.total}`}</p>

            <div className="w-[100%] gap-[16px] flex">
              <Button
                onClick={() => handleDeleteAttendance(attendanceId)}
                className="px-[28px] py-[12px] bg-white text-[#0DAA5C] border border-[#BEBEBF] hover:bg-[#f2f2f2]"
              >
                삭제
              </Button>
              <Button
                onClick={() => handleCloseQr(attendanceId)}
                className="px-[28px] py-[12px]"
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
