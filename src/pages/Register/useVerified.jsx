// 참고자료
// https://www.youtube.com/watch?v=pw58zxqxHOk&list=PLqFvlDFoiZ-0ixIS8D4JTHRuVy_rkfROY&index=5

import { useState } from 'react';

import pb from '@/api/pocketbase';

const REQUEST_FAILED_MESSAGE = `\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0통신 에러입니다.\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0`;
const WRONG_EMAIL_MESSAGE = '이메일을 확인해주세요';
const CHECK_MAILBOX_MESSAGE = '인증메일이 보내졌습니다. 메일함을 확인해주세요.';

export default function useVerified(email, isEmailValidated, isEmailUnique) {
  /* -------------------------------------------------------------------------- */
  /*         '인증하기' 버튼 누르면 버튼 disable 시키고 Input 필드 readonly 만들기         */
  /* -------------------------------------------------------------------------- */
  const [isVerificationButtonDisabled, setIsVerificationButtonDisabled] =
    useState(false);

  const [isEmailInputFieldReadOnly, setIsEmailInputFieldReadOnly] =
    useState(false);

  /* -------------------------------------------------------------------------- */
  /*           '인증하기' 버튼 클릭 시 나오는 모달창 컨트롤하기 위한 변수들                   */
  /* -------------------------------------------------------------------------- */
  const [isEmailVericationModalOpened, setIsEmailVericationModalOpened] =
    useState(false);

  const [emailVerificationModalMesseage, setEmailVerificationModalMesseage] =
    useState('');

  /* -------------------------------------------------------------------------- */
  /*                    이메일 인증을 위해서는 일단 register 필요                      */
  /* -------------------------------------------------------------------------- */
  const registerForEmailVerification = async (email) => {
    const data = {
      email: email,
      emailVisibility: true,
      password: '7Hx9eL3Pb1NcW4Qa2Rf5', //chatGPT가 만들어준 난수
      passwordConfirm: '7Hx9eL3Pb1NcW4Qa2Rf5',
    };

    try {
      await pb.collection('users').create(data);
    } catch (error) {
      setEmailVerificationModalMesseage(REQUEST_FAILED_MESSAGE);
      setIsEmailVericationModalOpened(true);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                         유저에게 인증메일 보내주는 함수                            */
  /* -------------------------------------------------------------------------- */
  const requestVerification = async (email) => {
    // const email = pb.authStore.model.email;
    const response = await pb.collection('users').requestVerification(email);
    try {
      if (response) {
        setEmailVerificationModalMesseage(CHECK_MAILBOX_MESSAGE);
        setIsEmailVericationModalOpened(true); //모달창 열여주기 (주의할 점 : requestVerification 함수가 setTimeout에 들어가있기 때문에 handleEmailVerification 바로 안에 setIsEmailVericationModalOpened을 해버리면 requestVerification 되기도 전에 모달창이 먼저 열려버림)
      }
    } catch (error) {
      setEmailVerificationModalMesseage(REQUEST_FAILED_MESSAGE);
      setIsEmailVericationModalOpened(true); //모달창 열여주기 (주의할 점 : requestVerification 함수가 setTimeout에 들어가있기 때문에 handleEmailVerification 바로 안에 setIsEmailVericationModalOpened을 해버리면 requestVerification 되기도 전에 모달창이 먼저 열려버림)
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                       '인증하기' 버튼에 달릴 handler                            */
  /* -------------------------------------------------------------------------- */
  const handleEmailVerification = async (e) => {
    e.preventDefault();

    if (isEmailValidated && isEmailUnique) {
      setIsVerificationButtonDisabled(true); //인증하기 버튼 비활성화
      setIsEmailInputFieldReadOnly(true); //이메일 입력필드 읽기전용화

      registerForEmailVerification(email); //임시적으로 이메일만으로 계정 생성

      //setTimeout 안 쓰면 requestVerification 안 먹힘.
      setTimeout(() => {
        requestVerification(email);
      }, 900);
    } else {
      setEmailVerificationModalMesseage(WRONG_EMAIL_MESSAGE);
      setIsEmailVericationModalOpened(true); //모달창 열여주기
    }
  };

  return {
    handleEmailVerification,
    emailVerificationModalMesseage,
    isEmailVericationModalOpened,
    setIsEmailVericationModalOpened,
    isVerificationButtonDisabled,
    isEmailInputFieldReadOnly,
  };
}
