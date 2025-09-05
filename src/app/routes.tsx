import Fail from '@/features/attendance-return/components/Fail';
import Success from '@/features/attendance-return/components/Success';
import AttendanceStatus from '@/features/attendance-status/AttendanceStatus';
import Attendance from '@/features/attendance/components/Attendance';
import Login from '@/features/login/components/Login';
import CreateMail from '@/features/mail-management/components/create-mail/CreateMail';
import EditMail from '@/features/mail-management/components/create-mail/EditMail';
import MailManagement from '@/features/mail-management/components/MailManagement';
import SessionManagement from '@/features/session-management/components/SessionManagement';
import { Navigate, Outlet } from 'react-router-dom';
import { OauthCallback } from '@/features/login/components/OauthCallback';
import { PrivateRoute } from '@/app/PrivateRoute';
import { PublicRoute } from '@/app/PublicRoute'
import { MemberInfo } from '@/features/member-info/components/MemberInfo';

const routes = () => [
  {
    path: '/attendance-return',
    element: <Outlet />,
    children: [
      {
        path: 'success',
        element: <Success />,
      },
      {
        path: 'fail',
        element: <Fail />,
      },
    ],
  },
  {
    path: '/app',
    element: <PrivateRoute />,
    children: [
      {
        index: true,
        element: <Navigate to="/app/attendance" />,
      },
      {
        path: 'attendance',
        element: <Attendance />,
      },
      {
        path: 'status',
        element: <AttendanceStatus />,
      },
      {
        path: 'info',
        element: <MemberInfo />,
      },
      {
        path: 'mail',
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <MailManagement />,
          },
          {
            path: 'create',
            element: <CreateMail />,
          },
          {
            path: 'edit/:id',
            element: <EditMail />,
          },
        ],
      },
      {
        path: 'session',
        element: <SessionManagement />,
      },
    ],
  },
  {
    path: '/',
    element: <PublicRoute />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'oauth/callback',
        element: <OauthCallback />,
      },
      {
        index: true,
        element: <Navigate to="/login" />,
      },
      {
        path: '*',
        element: <Navigate to="/login" />,
      },
    ],
  },
];

export default routes;
