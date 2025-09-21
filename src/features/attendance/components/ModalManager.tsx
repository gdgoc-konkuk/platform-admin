import React, { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import { CreateQRModal } from '@/features/attendance/components/CreateQRModal';
import { QRModal } from '@/features/attendance/components/QRModal';
import { useQuery } from '@tanstack/react-query';
import { postReAttendance } from '@/features/attendance/apis/attendanceRequest';

type EventData = {
  attendanceId: number;
  attendUrl: string;
};

type ResponseData = {
  message: string;
  data: EventData;
  success: boolean;
};

interface ModalManagerProps {
  selectedDate: dayjs.Dayjs;
  setSelectedDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  existedAttendanceId: number | null;
  existedTitle: string;
  refetch: () => void;
}

export const ModalManager: React.FC<ModalManagerProps> = ({
  selectedDate,
  setSelectedDate,
  existedAttendanceId,
  existedTitle,
  refetch,
}) => {
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(true);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(0);

  const [attendUrl, setAttendUrl] = useState('');
  const [attendanceId, setAttendanceId] = useState(0);

  const closeFirstModalAndOpenSecond = () => {
    setIsFirstModalOpen(false);
    setIsSecondModalOpen(true);
  };
  const closeSecondModal = () => {
    setIsSecondModalOpen(false);
    setSelectedDate(null);
  };

  const { data, error, isLoading } = useQuery<ResponseData>({
    queryKey: ['existed', existedAttendanceId],
    queryFn: () => postReAttendance(existedAttendanceId!),
    enabled: !!existedAttendanceId,
  });

  useEffect(() => {
    if (data && data.success && existedAttendanceId) {
      setAttendanceId(data.data.attendanceId);
      setAttendUrl(data.data.attendUrl);
      setTitle(existedTitle);
      closeFirstModalAndOpenSecond();
    }
  }, [data, existedAttendanceId, existedTitle]);

  return (
    <div>
      {isFirstModalOpen && (
        <CreateQRModal
          onClose={() => setIsFirstModalOpen(false)}
          closeFirstModalAndOpenSecond={closeFirstModalAndOpenSecond}
          title={title}
          setTitle={setTitle}
          numberOfPeople={numberOfPeople}
          setNumberOfPeople={setNumberOfPeople}
          setAttendUrl={setAttendUrl}
          setAttendanceId={setAttendanceId}
        />
      )}

      {isSecondModalOpen && (
        <QRModal
          title={title}
          selectedDate={selectedDate}
          closeSecondModal={closeSecondModal}
          attendanceId={attendanceId}
          attendUrl={attendUrl}
          refetch={refetch}
        />
      )}

      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {(error as Error).message}</div>}
    </div>
  );
};
