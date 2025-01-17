import { instance } from '@/lib/instance';
export interface AttendanceData {
  batch: string;
  year: string;
  month: string;
}

export const getEvents = async (params: AttendanceData) => {
  try {
    const response = await instance.get(
      `/members/${params.batch}/attendances`,
      {
        params,
      },
    );
    //console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
};
export const saveAttendances = async (
  attendanceUpdateInfoList: {
    participantId: number;
    attendanceType: 'ABSENT' | 'ATTEND' | 'LATE';
  }[], // 서버로 보낼 출석 정보 리스트
  params: AttendanceData, // URL에 추가되는 파라미터
) => {
  try {
    const response = await instance.patch(
      `/members/${params.batch}/attendances`,
      { attendanceUpdateInfoList },
      {
        params,
      },
    );
    //console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error((error as Error).message);
  }
};
