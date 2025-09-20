import { useState } from 'react';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ModalManager } from '@/features/attendance/components/ModalManager';
import { useQuery } from '@tanstack/react-query';
import { getAttendances } from '@/features/attendance/apis/attendanceRequest';
import ErrorPopup from '@/components/ui/ErrorPopup';
import { cn } from '@/lib/utils';

dayjs.extend(localeData);

export interface EventData {
  attendanceId: number | null;
  title: string | null;
  attendanceTime: string;
}

type ResponseData = {
  message: string;
  data: EventData[];
  success: boolean;
};

export default function Attendance() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [selectedYear, setSelectedYear] = useState(currentDate.year());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.month());

  const { data, error, isLoading, refetch } = useQuery<ResponseData>({
    queryKey: ['events', selectedYear, selectedMonth],
    queryFn: () =>
      getAttendances(selectedYear.toString(), (selectedMonth + 1).toString()),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }

  const handleDateClick = (date: dayjs.Dayjs) => {
    if (!date.isSame(dayjs(), 'month') || !date.isSame(dayjs(), 'day')) return;
    setSelectedDate(date);
  };

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
  const daysInMonth = currentDate.daysInMonth();
  const firstDayOfMonth = currentDate.startOf('month').day();

  return (
    <div>
      {error && <ErrorPopup />}
      <div className="flex flex-col items-center">
        <div>
          <h1 className="mb-[3vh] font-['NanumSquareRoundEB'] text-[24px] font-extrabold">
            출석
          </h1>
          <div className="w-[900px] pt-4 pl-11 pb-11 pr-11 border border-solid border-[#DADADA] rounded-3xl ">
            <div className="flex justify-start items-center mb-4">
              <Select onValueChange={handleYearChange}>
                <SelectTrigger className="w-[110px] mr-2 text-[#171719] font-[Pretendard] text-[22px] font-[600]">
                  <SelectValue placeholder={selectedYear} />
                </SelectTrigger>
                <SelectContent className="text-[#171719] font-[Pretendard] text-[22px] font-[600]">
                  {Array.from({ length: 10 }, (_, i) => (
                    <SelectItem
                      key={i}
                      value={(dayjs().year() - 5 + i).toString()}
                    >
                      {dayjs().year() - 5 + i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={handleMonthChange}>
                <SelectTrigger className="w-[80px] mr-2 text-[#171719] font-[Pretendard] text-[22px] font-[600]">
                  <SelectValue placeholder={selectedMonth + 1} />
                </SelectTrigger>
                <SelectContent className="mr-2 text-[#171719] font-[Pretendard] text-[22px] font-[600]">
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-[full] h-[1px] border-t my-4"></div>
            <div className="grid grid-cols-7 gap-2 ">
              {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                <div
                  key={day}
                  className="mb-[10px] text-start text-[#868687] text-[14px] font-[Pretendard] font-[600]"
                >
                  {day}
                </div>
              ))}

              {Array.from({ length: firstDayOfMonth - 1 }, (_, i) => (
                <div key={i}></div>
              ))}

              {Array.from({ length: daysInMonth }, (_, i) => (
                <div
                  key={'day' + i}
                  className={cn(
                    'w-[105px] h-[78px] px-[16px] py-[10px] rounded-[10px] transition duration-300',
                    currentDate.date(i + 1).isSame(dayjs(), 'day')
                      ? 'bg-gray-300  cursor-pointer hover:bg-gray-400'
                      : 'bg-[#F9F9F9] cursor-not-allowed',
                  )}
                  onClick={() => handleDateClick(currentDate.date(i + 1))}
                >
                  <span className="text-[#535355] font-[Pretendard] text-[16px] font-[600]">
                    {i + 1}
                  </span>
                  <div className="flex">
                    {data?.data.map((monthEvent: EventData) => {
                      const date = new Date(monthEvent.attendanceTime);
                      const day = date.getDate();
                      return day === i + 1 ? (
                        monthEvent.attendanceId ? (
                          <div
                            key={`event-${monthEvent.attendanceId}-${day}`}
                            className="w-[8px] h-[8px] bg-[#9747FF] rounded-[11px] mr-[3px]"
                          ></div>
                        ) : (
                          <div
                            key={`doneEvent-${monthEvent.attendanceId}-${day}`}
                            className="w-[8px] h-[8px] bg-[#EA4335] rounded-[11px] mr-[3px]"
                          ></div>
                        )
                      ) : null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedDate &&
            (() => {
              const matchedEvent = data?.data.find((event) =>
                dayjs(event.attendanceTime).isSame(selectedDate, 'day'),
              );

              return (
                <ModalManager
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  existedAttendanceId={matchedEvent?.attendanceId ?? null}
                  existedTitle={matchedEvent?.title ?? ''}
                  refetch={refetch}
                />
              );
            })()}
        </div>
      </div>
    </div>
  );
}
