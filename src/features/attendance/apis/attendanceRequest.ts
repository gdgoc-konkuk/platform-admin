import { instance } from '@/lib/instance';

export interface AttendanceData {
  title: string;
  batch: string;
}

// 달 별 출석 정보 가져오기
export const getAttendances = async (year: string, month: string) => {
  return await instance
    .get(`/attendances?year=${year}&month=${month}`)
    .then((res) => res.data);
};

// post 출석 -> qr url 받아오기
export const postNewAttendance = async (data: AttendanceData) => {
  try {
    const response = await instance.post(`/attendances`, data);
    //console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error as string);
  }
};

// post 재출석 -> qr url 다시 받아오기
export const postReAttendance = async (data: number) => {
  try {
    const response = await instance.post(`/attendances/${data}/qr`, { data });
    //console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error as string);
  }
};

// delete 출석 이벤트 -> attendanceId 삭제
export const deleteAttendance = async (attendanceId: number) => {
  try {
    const response = await instance.delete(
      `/attendances/${attendanceId}?attendanceId=${attendanceId}`,
    );
    //console.log(response);
    return response.data;
  } catch (error) {
    throw new Error(error as string);
  }
};

// delete QR -> QR 만료, 출석 종료
export const deleteAttendanceQR = async (attendanceId: number) => {
  try {
    const response = await instance.delete(
      `/attendances/${attendanceId}/qr?attendanceId=${attendanceId}`,
    );
    //console.log(response);
    return response.data;
  } catch (error) {
    throw new Error(error as string);
  }
};

// 출석현황 조회하기
export const getAttendancesStatus = async (attendanceId: number) => {
  try {
    const response = await instance.get(
      `/attendances/${attendanceId}/status?attendanceId=${attendanceId}`,
    );
    //console.log(response);
    return response.data.data;
  } catch (error) {
    throw new Error(error as string);
  }
};
