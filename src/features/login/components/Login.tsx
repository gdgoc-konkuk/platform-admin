import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Symbol from '/symbol.svg';
import IdIcon from '/icons/id.svg';
import PasswordIcon from '/icons/password.svg';
import BlackCloseIcon from '/icons/close-black.svg';
import GrayCloseIcon from '/icons/close-gray.svg';
import { useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { loginRequest } from '../apis/loginRequest';
import { loginFormSchema, LoginFormFields } from '../lib/loginFormSchema';
import { useAuth } from '@/stores/AuthProvider';

export default function Login() {
  const [idCloseHovered, setIdCloseHovered] = useState(false);
  const [passwordCloseHovered, setPasswordCloseHovered] = useState(false);
  const borderRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormFields>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit: SubmitHandler<LoginFormFields> = async (data) => {
    try {
      await loginRequest(data.id, data.password);
      setIsLoggedIn(true);
      navigate('/app/attendance');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          setError('root', {
            message: '아이디 또는 비밀번호가 일치하지 않습니다.',
          });
        } else {
          setError('root', {
            message: '서버에 문제가 발생했습니다. 다시 시도해주세요.',
          });
        }
      }
    }
  };

  return (
    <div className="flex h-full w-full font-pretendard">
      <div className="flex w-3/5 flex-col justify-between px-[50px] py-11">
        <img src={Symbol} alt="symbol" width="72px" />
        <h1 className="font-suite text-[80px] font-[900] leading-[120px]">
          KONKUK
          <br />
          CLUB
          <br />
          MANAGER
        </h1>
        <div className="w-1"></div>
      </div>
      <div className="flex w-2/5 flex-col items-center justify-between bg-background py-[53px]">
        <div className="w-1"></div>
        <a href="https://api.gdsc-konkuk.dev/login/oauth2/authorization/google">
          <Button className="w-[400px] h-[50px] text-[17px] font-semibold bg-[#EA4335] hover:bg-[#D93025]">
            구글로 로그인
          </Button>
        </a>
        <form
          className="w-[400px] flex flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="relative w-full">
            <img src={IdIcon} alt="id" className="absolute left-4 top-[14px]" />
            <Input
              {...register('id')}
              placeholder="아이디"
              className="h-[50px] rounded-b-none border-b-0 bg-white px-[54px] text-[16px] focus:border-[1.5px] focus:border-b-0 focus:border-[#0DAA5C]"
              onFocus={() => {
                borderRef.current?.style.setProperty(
                  'background-color',
                  '#0DAA5C',
                );
              }}
              onBlur={() => {
                borderRef.current?.style.setProperty(
                  'background-color',
                  '#E5E5E5',
                );
              }}
            />
            <img
              src={idCloseHovered ? BlackCloseIcon : GrayCloseIcon}
              alt="close"
              className="absolute right-4 top-[14px] cursor-pointer"
              onMouseEnter={() => setIdCloseHovered(true)}
              onMouseLeave={() => setIdCloseHovered(false)}
              onClick={() => setValue('id', '')}
            />
          </div>
          <div className="w-full h-[1.5px] bg-[#E5E5E5]" ref={borderRef}></div>
          <div className="relative w-full">
            <img
              src={PasswordIcon}
              alt="password"
              className="absolute left-4 top-[14px]"
            />
            <Input
              {...register('password')}
              placeholder="비밀번호"
              type="password"
              className="h-[50px] rounded-t-none border-t-0 bg-white px-[54px] text-[16px] focus:border-[1.5px] focus:border-t-0 focus:border-[#0DAA5C]"
              onFocus={() => {
                borderRef.current?.style.setProperty(
                  'background-color',
                  '#0DAA5C',
                );
              }}
              onBlur={() => {
                borderRef.current?.style.setProperty(
                  'background-color',
                  '#E5E5E5',
                );
              }}
            />
            <img
              src={passwordCloseHovered ? BlackCloseIcon : GrayCloseIcon}
              alt="close"
              className="absolute right-4 top-[14px] cursor-pointer"
              onMouseEnter={() => setPasswordCloseHovered(true)}
              onMouseLeave={() => setPasswordCloseHovered(false)}
              onClick={() => setValue('password', '')}
            />
          </div>
          <Button
            type="submit"
            className="mt-4 h-[50px] w-full text-[17px] font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </Button>
          <Link to="/password-change">
            <Button className="mt-4 w-full h-[50px] text-[17px] font-semibold bg-green-900 hover:bg-green-800">
              비밀번호 변경
            </Button>
          </Link>
          {errors.id && (
            <p className="text-red-500 text-[14px] mt-2">{errors.id.message}</p>
          )}
          {errors.password && (
            <p className="text-red-500 text-[14px] mt-2">
              {errors.password.message}
            </p>
          )}
          {errors.root && (
            <p className="text-red-500 text-[14px] mt-2">
              {errors.root.message}
            </p>
          )}
        </form>
        <h1 className="font-suite text-[40px] font-[900] leading-[50px] text-[#013318]">
          KUINSIDE
        </h1>
      </div>
    </div>
  );
}
