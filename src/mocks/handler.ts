import { http, HttpResponse } from 'msw';
import { MemberFormData, MemberInfo } from '@/features/member-info/types/member-info';
import { mockMembers } from '@/mocks/db';
import { CURRENT_BATCH } from '@/lib/constants';

const BASE_URL = import.meta.env.VITE_BASE_URL;
let nextId = mockMembers.length + 1;

export const handlers = [
  http.get(`${BASE_URL}/attendances`, ({ request }) => {
    const url = new URL(request.url);
    const year = url.searchParams.get('year');
    const month = url.searchParams.get('month');

    console.log(
      `[MSW] intercepted and mocked: ${request.method} ${request.url} (Year: ${year}, Month: ${month})`,
    );

    return HttpResponse.json({
      message: 'SUCCESS',
      data: [
        {
          attendanceId: 1,
          title: '9월 1주차 세션 (Mocked)',
          attendanceTime: '2025-09-02T19:00:00',
        },
        {
          attendanceId: 2,
          title: '9월 2주차 세션 (Mocked)',
          attendanceTime: '2025-09-09T18:55:00',
        },
        {
          attendanceId: 3,
          title: '9월 3주차 세션 (Mocked)',
          attendanceTime: '2025-09-16T19:10:00',
        },
      ],
      success: true,
    });
  }),

  http.get(`${BASE_URL}/emails`, () => {
    console.log(`[MSW] intercepted: GET /emails`);

    return HttpResponse.json({
      message: 'SUCCESS',
      data: {
        emailTasks: [
          {
            id: 25,
            subject: '테스트512 (Mocked)',
            receiverInfos: [{ email: '7chabin@naver.com', name: '황차빈' }],
            sendAt: '2025-08-20T20:50:00',
            isSent: true,
          },
          {
            id: 24,
            subject: '테스트메일입니다 (Mocked)',
            receiverInfos: [
              { email: '7chabin@naver.com', name: '황차빈' },
              { email: '7chabin@gmail.com', name: '황차빈2' },
            ],
            sendAt: '2025-08-20T19:50:00',
            isSent: true,
          },
          {
            id: 43,
            subject: 'GDGoC Konkuk 25-26 코어멤버 최종발표 (Mocked)',
            receiverInfos: [
              { email: 'contact.rlgnsdl0511@gmail.com', name: '김기훈' },
              { email: 'limgeeee02@gmail.com', name: '임지예' },
            ],
            sendAt: '2025-06-13T18:00:00',
            isSent: true,
          },
        ],
      },
      success: true,
    });
  }),

  http.get(`${BASE_URL}/emails/:id`, ({ params }) => {
    const { id } = params;
    console.log(`[MSW] intercepted: GET /emails/${id}`);

    return HttpResponse.json({
      message: 'SUCCESS',
      data: {
        subject: `테스트메일입니다 (ID: ${id} Mocked)`,
        content:
          '이 내용은 MSW가 보낸 가짜 메일 본문입니다. 실제 데이터가 아닙니다.',
        receiverInfos: [
          { email: '7chabin@naver.com', name: '황차빈' },
          { email: '7chabin@gmail.com', name: '황차빈2' },
        ],
        sendAt: '2025-08-20T19:50:00',
      },
      success: true,
    });
  }),

  http.get(`${BASE_URL}/members/${CURRENT_BATCH}`, () => {
    console.log('MSW: Fetched all members');
    return HttpResponse.json({
      message: 'SUCCESS',
      data: mockMembers,
      success: true,
    });
  }),

  http.post(`${BASE_URL}/members`, async ({ request }) => {
    const newMemberInfo = (await request.json()) as MemberFormData;

    console.log('MSW: Member added', newMemberInfo);
    mockMembers.push({ ...newMemberInfo, memberId: nextId++ });

    return HttpResponse.json({
      message: 'SUCCESS',
      data: newMemberInfo,
      success: true,
    });
  }),

  http.post(`${BASE_URL}/members/bulk`, async ({ request }) => {
    const newMemberInfos = (await request.json()) as MemberFormData[];

    console.log('MSW: Bulk members added', newMemberInfos);

    newMemberInfos.forEach((info) => {
      const newMember = { ...info };
      mockMembers.push({ ...newMember, memberId: nextId++ });
    });

    return HttpResponse.json({
      message: 'SUCCESS',
      data: newMemberInfos,
      success: true,
    });
  }),

  http.patch(
    `${BASE_URL}/members/${CURRENT_BATCH}`,
    async ({ request, params }) => {
      const { memberId } = params;
      const updates = (await request.json()) as Partial<MemberInfo>;
      const memberIndex = mockMembers.findIndex(
        (m) => m.memberId === Number(memberId),
      );

      mockMembers[memberIndex] = { ...mockMembers[memberIndex], ...updates };

      console.log('MSW: Member updated', mockMembers[memberIndex]);
      return HttpResponse.json({
        message: 'SUCCESS',
        data: mockMembers[memberIndex],
        success: true,
      });
    },
  ),

  http.delete(
    `${BASE_URL}/members/${CURRENT_BATCH}/:memberId`,
    ({ params }) => {
      const { memberId } = params;
      const memberIndex = mockMembers.findIndex(
        (m) => m.memberId === Number(memberId),
      );

      if (memberIndex === -1) {
        return HttpResponse.json(
          { message: 'Member not found' },
          { status: 404 },
        );
      }

      const [deletedMember] = mockMembers.splice(memberIndex, 1);

      console.log('MSW: Member deleted', deletedMember);
      return HttpResponse.json({
        message: 'SUCCESS',
        success: true,
      });
    },
  ),
];
