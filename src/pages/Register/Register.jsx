import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import debounce from '@/utils/debounce';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TermsCheckbox from './TermsCheckbox';
import useCheckbox from './useCheckbox';
import useSubmit from './useSubmit';
import useValidation from './useValidation';
import useVerified from './useVerified';
import usePages from './usePages';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
// import express from 'express';
// import phone from 'phone';
// import Twilio from './Twilio';

// export default function Register() {
//   return (
//     <div>
//       hello<br></br>hello<br></br>hello<br></br>hello<br></br>hello<br></br>
//       hello<br></br>hello<br></br>
//     </div>
//   );
// }

export default function Register() {
  /* -------------------------------------------------------------------------- */
  /*                                    커스텀훅                                    */
  /* -------------------------------------------------------------------------- */
  const {
    formData,
    isValidatedList,
    isOnceList,
    isAllFilled,
    isAllValidated,
    isEmailUnique,
    handleInputChange,
    setBirth,
  } = useValidation();

  const {
    handleEmailVerification,
    emailVerificationModalMesseage,
    isEmailVericationModalOpened,
    setIsEmailVericationModalOpened,
    isVerificationButtonDisabled,
    isEmailInputFieldReadOnly,
  } = useVerified(formData.email, isValidatedList.email, isEmailUnique);

  const {
    termsCheckboxList,
    checkList,
    checkedList,
    isRequiredChecked,
    handleCheckboxChange,
    agreeAllButtonStyle,
    handleAgreeAll,
  } = useCheckbox();

  const {
    submitModalMesseage,
    isSubmitModalOpened,
    setIsSubmitModalOpened,
    setIsEnterPressed,
    isRegisterButtonDisabled,
    handleSubmit,
  } = useSubmit(
    formData,
    isAllFilled,
    isAllValidated,
    isEmailUnique,
    isVerificationButtonDisabled,
    isRequiredChecked
  );

  const {
    progressBarWidth,
    registerPages,
    currentPageNumber,
    isNextButtonDisabled,
    handleNextButton,
    handlePreviousButton,
  } = usePages(
    formData,
    isValidatedList,
    isEmailUnique,
    isVerificationButtonDisabled,
    isRequiredChecked
  );

  /* -------------------------------------------------------------------------- */
  /*                                     마크업                                    */
  /* -------------------------------------------------------------------------- */

  return (
    <>
      {/* -------------------------------------------------------------------------- */
      /*                                   모바일 버전                                  */
      /* -------------------------------------------------------------------------- */}
      <div className="relative h-600pxr bg-white desktop:hidden">
        <div className="absolute left-[50%] top-[50%] h-400pxr w-275pxr translate-x-[-50%] translate-y-[-50%] overflow-hidden p-5pxr">
          <div className="mb-25pxr text-center text-3xl font-b04 text-primary">
            회원가입
          </div>

          <div className="mb-15pxr h-3pxr bg-tertiary">
            <div
              className={`h-3pxr bg-primary`}
              style={{ width: `${progressBarWidth}` }}
            ></div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-row gap-35pxr"
            // style={{ transform: `translateX(-${300 * currentPageNumber}px)` }}
          >
            {/* -------------------------------------------------------------------------- */
            /*                                    이용약관 동의                                */
            /* -------------------------------------------------------------------------- */}
            {registerPages[currentPageNumber] === 'agree' && (
              <div className="agree flex flex-col">
                <div className="font-extrabold text-contentPrimary">
                  SHOONG 서비스 이용약관에
                  <br /> 동의해주세요.
                </div>

                <Button
                  type="button"
                  onClick={handleAgreeAll}
                  customClassNames={`${agreeAllButtonStyle.bg} ${agreeAllButtonStyle.text} mt-3 focus-visible:outline outline-2 outline-offset-2 outline-black`}
                >
                  네, 모두 동의합니다.
                </Button>

                <div className="mt-3 flex flex-col gap-3 px-2">
                  {termsCheckboxList.map((item, index) => (
                    <TermsCheckbox
                      key={index}
                      name={checkList[index]}
                      checkedList={checkedList}
                      onChange={handleCheckboxChange}
                    >
                      {item}
                    </TermsCheckbox>
                  ))}
                </div>

                <Button
                  type="button"
                  isDisabled={isNextButtonDisabled['agree']}
                  customClassNames="mt-4 focus-visible:outline outline-2 outline-offset-2 outline-black"
                  onClick={handleNextButton}
                >
                  다음
                </Button>
              </div>
            )}
            {/* -------------------------------------------------------------------------- */
            /*                                    email                                   */
            /* -------------------------------------------------------------------------- */}
            {registerPages[currentPageNumber] === 'email' && (
              <div className="email flex flex-col">
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="shoong@gmail.com"
                  customClassNames="bg-gray-100 h-9 mt-1"
                  isLabeled
                  label="이메일"
                  readOnly={isEmailInputFieldReadOnly}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setIsEnterPressed(true);
                  }} //엔터키로 submit되는 거 막기 위해 isEnterPressed로 관리
                />

                <p //email 인풋 박스 비워져있는데 한 번이라도 입력한 적 있으면 입력하라는 메시지 보여주기
                  className={`${formData.email === '' && isOnceList.current.email ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
                >
                  이메일을 입력해주세요
                </p>

                <p //email 인풋 박스 채워졌는데 이메일 형식 안 지켰으면 형식 지키라는 메시지 보여주기
                  className={`${formData.email !== '' && !isValidatedList.email ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
                >
                  이메일 형식으로 입력해주세요
                </p>

                <p //email 이메일 형식 지켜서 잘 입력했는데 이미 가입된 이메일이면 이미 가입된 메일이라는 메시지 보여주기
                  className={`${isValidatedList.email && !isEmailUnique ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
                >
                  이미 가입된 이메일입니다.
                </p>

                <Button
                  type="button"
                  isSmall
                  customClassNames="self-end mt-2 focus-visible:outline outline-2 outline-offset-2 outline-black"
                  onClick={handleEmailVerification}
                  isDisabled={isVerificationButtonDisabled}
                >
                  인증하기
                </Button>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    customClassNames="mt-4 w-130pxr focus-visible:outline outline-2 outline-offset-2 outline-black"
                    onClick={handlePreviousButton}
                  >
                    이전
                  </Button>
                  <Button
                    type="button"
                    isDisabled={isNextButtonDisabled['email']}
                    customClassNames="mt-4 w-130pxr focus-visible:outline outline-2 outline-offset-2 outline-black"
                    onClick={handleNextButton}
                  >
                    다음
                  </Button>
                </div>
              </div>
            )}
            {/* -------------------------------------------------------------------------- */
            /*                                    pwd                                     */
            /* -------------------------------------------------------------------------- */}
            {registerPages[currentPageNumber] === 'pwd' && (
              <div className="pwd flex flex-col">
                <Input
                  name="pwd"
                  value={formData.pwd}
                  onChange={handleInputChange}
                  type="password"
                  customClassNames="bg-gray-100 h-9 mt-1"
                  placeholder="비밀번호 입력"
                  isLabeled
                  label="비밀번호"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setIsEnterPressed(true);
                  }} //엔터키로 submit되는 거 막기 위해 isEnterPressed로 관리
                />

                <p //pwd 길이 10자 안 되는데 한 번이라도 입력한 적 있으면 입력하라는 메시지 보여주기
                  className={`${formData.pwd.length < 10 && isOnceList.current.pwd ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
                >
                  최소 10자 이상 입력해주세요.
                </p>
                <p //pwd 길이 10자 넘었는데 패스워드 형식 안 지켰으면 형식 지키라는 메시지 보여주기
                  className={`${formData.pwd.length >= 10 && !isValidatedList.pwd ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
                >
                  영문/숫자/특수문자(공백 제외)만 허용, 2개 이상 조합
                </p>

                {/* -------------------------------------------------------------------------- */
                /*                                    pwdConfirm                               */
                /* -------------------------------------------------------------------------- */}

                <Input
                  name="pwdConfirm"
                  value={formData.pwdConfirm}
                  onChange={handleInputChange}
                  type="password"
                  placeholder="비밀번호 재확인"
                  customClassNames="bg-gray-100 h-9 mt-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setIsEnterPressed(true);
                  }} //엔터키로 submit되는 거 막기 위해 isEnterPressed로 관리
                />

                <p //pwdConfirm 인풋 박스 비워져있는데 한 번이라도 입력한 적 있으면 입력하라는 메시지 보여주기
                  className={`${formData.pwdConfirm === '' && isOnceList.current.pwdConfirm ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
                >
                  비밀번호를 한 번 더 입력해주세요.
                </p>
                <p //pwdConfirm 인풋 박스 채워졌는데 pwd랑 안 똑같으면 동일한 비번 입력하라는 메시지 보여주기
                  className={`${formData.pwdConfirm !== '' && !isValidatedList.pwdConfirm ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
                >
                  동일한 비밀번호를 입력해주세요.
                </p>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    customClassNames="mt-4 w-130pxr focus-visible:outline outline-2 outline-offset-2 outline-black"
                    onClick={handlePreviousButton}
                  >
                    이전
                  </Button>
                  <Button
                    type="button"
                    isDisabled={isNextButtonDisabled['pwd']}
                    customClassNames="mt-4 w-130pxr focus-visible:outline outline-2 outline-offset-2 outline-black"
                    onClick={handleNextButton}
                  >
                    다음
                  </Button>
                </div>
              </div>
            )}
            {/* -------------------------------------------------------------------------- */
            /*                                    name                                   */
            /* -------------------------------------------------------------------------- */}
            {registerPages[currentPageNumber] === 'name' && (
              <div className="name flex flex-col">
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="김슝 / Shoong Kim"
                  customClassNames="bg-gray-100 h-9 mt-1"
                  isLabeled
                  label="이름"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setIsEnterPressed(true);
                  }} //엔터키로 submit되는 거 막기 위해 isEnterPressed로 관리
                />

                <p //name 인풋 박스 비워져있는데 한 번이라도 입력한 적 있으면 입력하라는 메시지 보여주기
                  className={`${formData.name === '' && isOnceList.current.name ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
                >
                  이름을 입력해주세요
                </p>

                <p //name 인풋 박스 채워졌는데 이름 형식 안 지켰으면 형식 지키라는 메시지 보여주기
                  className={`${formData.name !== '' && !isValidatedList.name ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
                >
                  이름 형식으로 입력해주세요
                </p>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    customClassNames="mt-4 w-130pxr focus-visible:outline outline-2 outline-offset-2 outline-black"
                    onClick={handlePreviousButton}
                  >
                    이전
                  </Button>
                  <Button
                    type="button"
                    isDisabled={isNextButtonDisabled['name']}
                    customClassNames="mt-4 w-130pxr focus-visible:outline outline-2 outline-offset-2 outline-black"
                    onClick={handleNextButton}
                  >
                    다음
                  </Button>
                </div>
              </div>
            )}
            {/* -------------------------------------------------------------------------- */
            /*                                    phone                                   */
            /* -------------------------------------------------------------------------- */}
            {registerPages[currentPageNumber] === 'phone' && (
              <div className="phone flex flex-col">
                <Input
                  name="phone"
                  value={formData.phone}
                  //debounce 적용하려면 value 대신 defaultValue 써야 되는데 그렇게 되면 숫자만 입력되게 만들지를 못함..
                  onChange={handleInputChange}
                  type="text"
                  placeholder="01012345678"
                  customClassNames="bg-gray-100 h-9 mt-1"
                  isLabeled
                  label="휴대폰 번호"
                  maxLength="11"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setIsEnterPressed(true);
                  }} //엔터키로 submit되는 거 막기 위해 isEnterPressed로 관리
                />

                <p //phone 인풋 박스 비워져있는데 한 번이라도 입력한 적 있으면 입력하라는 메시지 보여주기
                  className={`${formData.phone === '' && isOnceList.current.phone ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
                >
                  휴대폰번호를 입력해주세요.
                </p>

                <p //phone 인풋 박스 채워졌는데 11자리 안 되면 제대로 입력하라는 메시지 보여주기
                  className={`${formData.phone !== '' && !isValidatedList.phone ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
                >
                  휴대폰번호를 올바르게 입력해주세요.
                </p>

                {/* <Button
          type="button"
          isSmall
          customClassNames="self-end mt-2 w-96pxr"
        >
          인증번호 받기
        </Button> */}

                <div className="flex justify-between">
                  <Button
                    type="button"
                    customClassNames="mt-4 w-130pxr focus-visible:outline outline-2 outline-offset-2 outline-black"
                    onClick={handlePreviousButton}
                  >
                    이전
                  </Button>
                  <Button
                    type="button"
                    isDisabled={isNextButtonDisabled['phone']}
                    customClassNames="mt-4 w-130pxr focus-visible:outline outline-2 outline-offset-2 outline-black"
                    onClick={handleNextButton}
                  >
                    다음
                  </Button>
                </div>
              </div>
            )}
            {/* ---------------------------------- 참고자료 ---------------------------------- */}
            {/* ---------------------- https://dawonny.tistory.com/403 ------------------- */}
            {/* ------------ https://mui.com/x/react-date-pickers/date-picker/ ----------- */}
            {/* ----------- https://mui.com/x/react-date-pickers/custom-field/ ----------- */}
            {/* ------------- https://mui.com/x/api/date-pickers/date-picker/ ------------ */}
            {registerPages[currentPageNumber] === 'birth' && (
              <div className="birth flex flex-col gap-1">
                <div className="text-xs font-semibold text-primary">
                  생년월일
                </div>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    className="MuiOutlinedInput-notchedOutline MuiInputBase-root"
                    onChange={setBirth}
                    format="YYYY / MM / DD"
                    slotProps={{
                      textField: {
                        size: 'small',
                        sx: {
                          fontSize: '1px',
                          borderRadius: '0.625rem',
                          width: '16.56rem',
                          height: '2.22rem',
                          backgroundColor: 'rgb(243 244 246)',
                          contentEditable: 'false',
                        },
                      },
                    }}
                    style={{ width: '2000px' }}
                  />
                </LocalizationProvider>

                <p //birth 인풋 박스 비워져있는데 한 번이라도 입력한 적 있으면 입력하라는 메시지 보여주기
                  className={`${isOnceList.birth === true && formData.birth === '' ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
                >
                  생년월일을 입력해주세요.
                </p>

                <p //birth 인풋 박스 채워졌는데 형식이 올바르지 않으면 올바르게 입력하라는 메시지 보여주기
                  className={`${formData.birth !== '' && !isValidatedList.birth ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
                >
                  생년월일을 올바르게 입력해주세요.
                </p>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    customClassNames="mt-4 w-130pxr focus-visible:outline outline-2 outline-offset-2 outline-black"
                    onClick={handlePreviousButton}
                  >
                    이전
                  </Button>
                  <Button
                    type="submit"
                    isDisabled={isRegisterButtonDisabled}
                    customClassNames="mt-4 w-130pxr focus-visible:outline outline-2 outline-offset-2 outline-black"
                  >
                    가입하기
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* -------------------------------------------------------------------------- */
      /*                                  데스크톱 버전                                  */
      /* -------------------------------------------------------------------------- */}
      <div className="hidden bg-white pb-10 desktop:block">
        <div className="mb-25pxr text-center text-3xl font-b04 text-primary">
          회원가입
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-265pxr flex-col gap-6"
        >
          {/* -------------------------------------------------------------------------- */
          /*                                    name                                   */
          /* -------------------------------------------------------------------------- */}
          <div className="name flex flex-col">
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              type="text"
              placeholder="김슝 / Shoong Kim"
              customClassNames="bg-gray-100 h-9 mt-1"
              isLabeled
              label="이름"
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsEnterPressed(true);
              }} //엔터키로 submit되는 거 막기 위해 isEnterPressed로 관리
            />

            <p //name 인풋 박스 비워져있는데 한 번이라도 입력한 적 있으면 입력하라는 메시지 보여주기
              className={`${formData.name === '' && isOnceList.current.name ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
            >
              이름을 입력해주세요
            </p>

            <p //name 인풋 박스 채워졌는데 이름 형식 안 지켰으면 형식 지키라는 메시지 보여주기
              className={`${formData.name !== '' && !isValidatedList.name ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
            >
              이름 형식으로 입력해주세요
            </p>
          </div>
          {/* -------------------------------------------------------------------------- */
          /*                                    email                                   */
          /* -------------------------------------------------------------------------- */}
          <div className="email flex flex-col">
            <Input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              type="text"
              placeholder="shoong@gmail.com"
              customClassNames="bg-gray-100 h-9 mt-1"
              isLabeled
              label="이메일"
              readOnly={isEmailInputFieldReadOnly}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsEnterPressed(true);
              }} //엔터키로 submit되는 거 막기 위해 isEnterPressed로 관리
            />

            <p //email 인풋 박스 비워져있는데 한 번이라도 입력한 적 있으면 입력하라는 메시지 보여주기
              className={`${formData.email === '' && isOnceList.current.email ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
            >
              이메일을 입력해주세요
            </p>

            <p //email 인풋 박스 채워졌는데 이메일 형식 안 지켰으면 형식 지키라는 메시지 보여주기
              className={`${formData.email !== '' && !isValidatedList.email ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
            >
              이메일 형식으로 입력해주세요
            </p>

            <p //email 이메일 형식 지켜서 잘 입력했는데 이미 가입된 이메일이면 이미 가입된 메일이라는 메시지 보여주기
              className={`${isValidatedList.email && !isEmailUnique ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
            >
              이미 가입된 이메일입니다.
            </p>

            <Button
              type="button"
              isSmall
              customClassNames="self-end mt-2 focus-visible:outline outline-2 outline-offset-2 outline-black"
              onClick={handleEmailVerification}
              isDisabled={isVerificationButtonDisabled}
            >
              인증하기
            </Button>
          </div>
          {/* -------------------------------------------------------------------------- */
          /*                                    pwd                                     */
          /* -------------------------------------------------------------------------- */}
          <div className="pwd flex flex-col">
            <Input
              name="pwd"
              value={formData.pwd}
              onChange={handleInputChange}
              type="password"
              customClassNames="bg-gray-100 h-9 mt-1"
              placeholder="비밀번호 입력"
              isLabeled
              label="비밀번호"
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsEnterPressed(true);
              }} //엔터키로 submit되는 거 막기 위해 isEnterPressed로 관리
            />

            <p //pwd 길이 10자 안 되는데 한 번이라도 입력한 적 있으면 입력하라는 메시지 보여주기
              className={`${formData.pwd.length < 10 && isOnceList.current.pwd ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
            >
              최소 10자 이상 입력해주세요.
            </p>
            <p //pwd 길이 10자 넘었는데 패스워드 형식 안 지켰으면 형식 지키라는 메시지 보여주기
              className={`${formData.pwd.length >= 10 && !isValidatedList.pwd ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
            >
              영문/숫자/특수문자(공백 제외)만 허용, 2개 이상 조합
            </p>

            {/* -------------------------------------------------------------------------- */
            /*                                    pwdConfirm                               */
            /* -------------------------------------------------------------------------- */}

            <Input
              name="pwdConfirm"
              value={formData.pwdConfirm}
              onChange={handleInputChange}
              type="password"
              placeholder="비밀번호 재확인"
              customClassNames="bg-gray-100 h-9 mt-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsEnterPressed(true);
              }} //엔터키로 submit되는 거 막기 위해 isEnterPressed로 관리
            />

            <p //pwdConfirm 인풋 박스 비워져있는데 한 번이라도 입력한 적 있으면 입력하라는 메시지 보여주기
              className={`${formData.pwdConfirm === '' && isOnceList.current.pwdConfirm ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
            >
              비밀번호를 한 번 더 입력해주세요.
            </p>
            <p //pwdConfirm 인풋 박스 채워졌는데 pwd랑 안 똑같으면 동일한 비번 입력하라는 메시지 보여주기
              className={`${formData.pwdConfirm !== '' && !isValidatedList.pwdConfirm ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
            >
              동일한 비밀번호를 입력해주세요.
            </p>
          </div>

          {/* -------------------------------------------------------------------------- */
          /*                                    phone                                   */
          /* -------------------------------------------------------------------------- */}
          <div className="phone flex flex-col">
            <Input
              name="phone"
              value={formData.phone}
              //debounce 적용하려면 value 대신 defaultValue 써야 되는데 그렇게 되면 숫자만 입력되게 만들지를 못함..
              onChange={handleInputChange}
              type="text"
              placeholder="01012345678"
              customClassNames="bg-gray-100 h-9 mt-1"
              isLabeled
              label="휴대폰 번호"
              maxLength="11"
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsEnterPressed(true);
              }} //엔터키로 submit되는 거 막기 위해 isEnterPressed로 관리
            />

            <p //phone 인풋 박스 비워져있는데 한 번이라도 입력한 적 있으면 입력하라는 메시지 보여주기
              className={`${formData.phone === '' && isOnceList.current.phone ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
            >
              휴대폰번호를 입력해주세요.
            </p>

            <p //phone 인풋 박스 채워졌는데 11자리 안 되면 제대로 입력하라는 메시지 보여주기
              className={`${formData.phone !== '' && !isValidatedList.phone ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
            >
              휴대폰번호를 올바르게 입력해주세요.
            </p>

            {/* <Button
          type="button"
          isSmall
          customClassNames="self-end mt-2 w-96pxr"
        >
          인증번호 받기
        </Button> */}
          </div>

          {/* ---------------------------------- 참고자료 ---------------------------------- */}
          {/* ---------------------- https://dawonny.tistory.com/403 ------------------- */}
          {/* ------------ https://mui.com/x/react-date-pickers/date-picker/ ----------- */}
          {/* ----------- https://mui.com/x/react-date-pickers/custom-field/ ----------- */}
          {/* ------------- https://mui.com/x/api/date-pickers/date-picker/ ------------ */}
          <div className="birth flex flex-col gap-1">
            <div className="text-xs font-semibold text-primary">생년월일</div>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                className="MuiOutlinedInput-notchedOutline MuiInputBase-root"
                onChange={setBirth}
                format="YYYY / MM / DD"
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: {
                      fontSize: '1px',
                      borderRadius: '0.625rem',
                      width: '16.56rem',
                      height: '2.22rem',
                      backgroundColor: 'rgb(243 244 246)',
                      contentEditable: 'false',
                    },
                  },
                }}
                style={{ width: '2000px' }}
              />
            </LocalizationProvider>

            <p //birth 인풋 박스 비워져있는데 한 번이라도 입력한 적 있으면 입력하라는 메시지 보여주기
              className={`${isOnceList.birth === true && formData.birth === '' ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
            >
              생년월일을 입력해주세요.
            </p>

            <p //birth 인풋 박스 채워졌는데 형식이 올바르지 않으면 올바르게 입력하라는 메시지 보여주기
              className={`${formData.birth !== '' && !isValidatedList.birth ? '' : 'hidden'} mt-1 pl-2 text-xs text-red-500`}
            >
              생년월일을 올바르게 입력해주세요.
            </p>
          </div>

          {/* -------------------------------------------------------------------------- */
          /*                                    이용약관 동의                                */
          /* -------------------------------------------------------------------------- */}
          <div className="agree mb-4 flex w-full flex-col">
            <div className="self-start text-xs font-extrabold text-neutral-700">
              이용 약관 동의
            </div>

            <Button
              type="button"
              onClick={handleAgreeAll}
              customClassNames={`${agreeAllButtonStyle.bg} ${agreeAllButtonStyle.text} mt-1 focus-visible:outline outline-2 outline-offset-2 outline-black`}
            >
              네, 모두 동의합니다.
            </Button>

            <div className="mt-3 flex flex-col gap-3 px-2">
              {termsCheckboxList.map((item, index) => (
                <TermsCheckbox
                  key={index}
                  name={checkList[index]}
                  checkedList={checkedList}
                  onChange={handleCheckboxChange}
                >
                  {item}
                </TermsCheckbox>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            isDisabled={isRegisterButtonDisabled}
            customClassNames="focus-visible:outline outline-2 outline-offset-2 outline-black"
          >
            가입하기
          </Button>
        </form>
      </div>

      <ConfirmationModal
        isOpen={isEmailVericationModalOpened}
        onConfirm={() => {
          setIsEmailVericationModalOpened(!isEmailVericationModalOpened);
        }}
        message={emailVerificationModalMesseage}
        showCancelButton={false}
      />
      <ConfirmationModal
        isOpen={isSubmitModalOpened}
        onConfirm={() => {
          setIsSubmitModalOpened(!isSubmitModalOpened);
        }}
        message={submitModalMesseage}
        showCancelButton={false}
      />
    </>
  );
}
