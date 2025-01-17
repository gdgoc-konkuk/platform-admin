export interface AttendanceInfo {
  attendanceId: number;
  memberId: number;
  attendanceDate: string;
  participantId: number;
  attendanceType: 'ABSENT' | 'ATTEND' | 'LATE';
}

export interface Member {
  actualAttendances: number;
  attendanceInfoList: AttendanceInfo[];
  department: string | null;
  memberId: number;
  memberName: string;
  memberRole: string;
  totalAttendances: number;
}

export interface ResponseData {
  message: string;
  data: Member[];
  success: boolean;
}
