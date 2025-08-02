import { Button } from '@/components/ui/button';
import Symbol from '/symbol.svg';
import Google from '/google.png';

export default function Login() {
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
        <a href="https://admin.gdgoc-konkuk.com/login/oauth2/authorization/google">
          <Button className="w-[400px] h-[50px] text-[17px] font-semibold bg-white text-black hover:bg-[#f2f2f2] flex items-center rounded-3xl">
            <img src={Google} alt="google" width="30px" className="mr-3" />
            구글로 로그인
          </Button>
        </a>
        <h1 className="font-suite text-[40px] font-[900] leading-[50px] text-[#013318]">
          KUINSIDE
        </h1>
      </div>
    </div>
  );
}
