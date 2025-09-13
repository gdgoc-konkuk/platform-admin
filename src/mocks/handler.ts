import { http, HttpResponse } from 'msw';

const BASE_URL = import.meta.env.VITE_BASE_URL;

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

  http.get(`${BASE_URL}/members/25-26`, () => {
    return HttpResponse.json({
      message: 'SUCCESS',
      data: [
        {
          batch: "25-26",
          department: "사회환경공학",
          email: "kjhwan0802@gmail.com",
          memberId: 20,
          name: "김지환",
          role: "ROLE_CORE",
          studentId: "201911560",
        },
      ],
      success: true,
    });
  }),

  http.patch(`${BASE_URL}/members/25-26`, async ({ request }) => {
    const body = await request.json();
    console.log('[MSW] intercepted: PATCH /members/25-26', body);
    return HttpResponse.json({
      message: 'SUCCESS',
      success: true,
    });
  }),
];
