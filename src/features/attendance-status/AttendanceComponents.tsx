import React from 'react';
import { Member } from './types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import CheckedIcon from '/icons/checked.svg';
import UncheckedIcon from '/icons/unchecked.svg';
import LateCheckedIcon from '/icons/late-checked.svg';

interface SelectYearMonthProps {
  selectedYear: number;
  selectedMonth: number;
  handleYearChange: (value: string) => void;
  handleMonthChange: (value: string) => void;
}

export const SelectYearMonth: React.FC<SelectYearMonthProps> = ({
  selectedYear,
  selectedMonth,
  handleYearChange,
  handleMonthChange,
}) => (
  <div className="flex justify-start items-center mb-4">
    <Select onValueChange={handleYearChange}>
      <SelectTrigger className="w-[110px] mr-2 text-[#171719] font-[Pretendard] text-[22px] font-[600]">
        <SelectValue placeholder={selectedYear} />
      </SelectTrigger>
      <SelectContent className="text-[#171719] font-[Pretendard] text-[22px] font-[600]">
        {Array.from({ length: 10 }, (_, i) => (
          <SelectItem
            key={i}
            value={(new Date().getFullYear() - 5 + i).toString()}
          >
            {new Date().getFullYear() - 5 + i}
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
);

interface AttendanceTableProps {
  recordsData: { data: Member[] } | undefined;
  editedData: Member[] | null;
  isEditing: boolean;
  handleCheckboxChange: (memberIndex: number, attendanceIndex: number) => void;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  recordsData,
  editedData,
  isEditing,
  handleCheckboxChange,
}) => (
  <div className="overflow-y-auto h-[70vh]">
    <table className="w-full table-auto">
      <thead className="sticky top-0 z-10 bg-white">
        <tr className="text-left">
          <th className="px-4 py-2">이름</th>
          <th className="px-4 py-2">학과</th>
          <th className="px-4 py-2">결과</th>
          <th className="px-4 py-2">역할</th>
          {recordsData?.data[0]?.attendanceInfoList?.map((attendanceInfo) => (
            <th key={attendanceInfo.attendanceDate} className="px-4 py-2">
              {attendanceInfo.attendanceDate.substring(8, 10)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="border-t">
        {editedData?.map((record, memberIndex) => (
          <tr
            key={memberIndex}
            className="text-[#333335] font-pretendard text-base font-semibold "
          >
            <td className="px-4 py-2">{record.memberName}</td>
            <td className="px-4 py-2">{record.department}</td>
            <td className="px-4 py-2">{`${record.actualAttendances}/${record.totalAttendances}`}</td>
            <td className="px-4 py-2">{record.memberRole}</td>
            {record.attendanceInfoList.map(
              (attendanceInfo, attendanceIndex) => (
                <td
                  key={attendanceInfo.attendanceId}
                  className="px-4 py-2 text-center"
                >
                  <div className="flex">
                    {isEditing ? (
                      <div>
                        <img
                          src={
                            attendanceInfo.attendanceType === 'ATTEND'
                              ? CheckedIcon
                              : attendanceInfo.attendanceType === 'LATE'
                                ? LateCheckedIcon
                                : UncheckedIcon
                          }
                          className="cursor-pointer"
                          onClick={() =>
                            handleCheckboxChange(memberIndex, attendanceIndex)
                          }
                          alt="checkbox"
                        />
                      </div>
                    ) : attendanceInfo.attendanceType === 'ATTEND' ? (
                      <p className="ml-[4px]">o</p>
                    ) : attendanceInfo.attendanceType === 'LATE' ? (
                      <p>△</p>
                    ) : (
                      <p className="ml-[4px]">x</p>
                    )}
                  </div>
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
