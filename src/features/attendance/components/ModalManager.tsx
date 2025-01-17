import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import { CreateQRModal } from './CreateQRModal';
import { QRModal } from './QRModal';

interface ModalManagerProps {
  selectedDate: dayjs.Dayjs;
  setSelectedDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  refetch: () => void;
}

export const ModalManager: React.FC<ModalManagerProps> = ({
  selectedDate,
  setSelectedDate,
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

  return (
    <div>
      {isFirstModalOpen && (
        <CreateQRModal
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
    </div>
  );
};
