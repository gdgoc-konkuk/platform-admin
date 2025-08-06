import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEvents } from '../apis/attendanceStatusRequest';
import dayjs from 'dayjs';
import { ResponseData } from '../types';

export const useAttendanceStatus = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedYear, setSelectedYear] = useState(currentDate.year());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.month());

  const params = {
    batch: '25-26',
    year: selectedYear.toString(),
    month: (selectedMonth + 1).toString(),
  };

  const {
    data: recordsData,
    error,
    isLoading,
  } = useQuery<ResponseData>({
    queryKey: ['eventStatus', selectedYear, selectedMonth],
    queryFn: () => getEvents(params),
  });

  const handleYearChange = (value: string) => {
    const newYear = Number(value);
    setSelectedYear(newYear);
    setCurrentDate(currentDate.year(newYear));
  };

  const handleMonthChange = (value: string) => {
    const newMonth = Number(value);
    setSelectedMonth(newMonth);
    setCurrentDate(currentDate.month(newMonth));
  };

  return {
    recordsData,
    error,
    isLoading,
    selectedYear,
    selectedMonth,
    handleYearChange,
    handleMonthChange,
  };
};
