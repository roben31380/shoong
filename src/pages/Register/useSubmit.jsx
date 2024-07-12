import { useEffect, useState } from 'react';
import pb from '@/api/pocketbase';
import { useNavigate } from 'react-router-dom';

const GREETING_MESSEAGE = `\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0환영합니다!\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0`;
const PLEASE_VERIFY_MESSAGE = '이메일 인증을 진행해주세요';
const NOT_VERIFIED_MESSAGE = '이메일이 인증되지 않았습니다';
const REQUEST_FAILED_MESSAGE = `\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0통신 에러입니다.\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0`;

export default function useSubmit(
  formData,
  isAllFilled,
  isAllValidated,
  isEmailUnique,
  isVerificationButtonDisabled,
  isRequiredChecked
) {
  const navigate = useNavigate();

  /* -------------------------------------------------------------------------- */
  /*              '가입하기' 버튼 누르면 뜨는 모달창 컨트롤하기 위한 변수들                   */
  /* -------------------------------------------------------------------------- */
  const [isSubmitModalOpened, setIsSubmitModalOpened] = useState(false);

  const [submitModalMesseage, setSubmitModalMesseage] = useState('');

  /* -------------------------------------------------------------------------- */
  /*               Input 컴포넌트에서 엔터키로 submit 되는 것 막기 위한 장치               */
  /* -------------------------------------------------------------------------- */
  const [isEnterPressed, setIsEnterPressed] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                  유효성 검사 등을 다 통과해야 회원가입 버튼 활성화                    */
  /* -------------------------------------------------------------------------- */
  const [isRegisterButtonDisabled, setIsRegisterButtonDisabled] =
    useState(true);

  //setIsRegisterButtonDisabled를 useEffect에 안 넣고 그냥 상태 변경해버리면 무한 루프에 빠짐.
  useEffect(() => {
    if (isAllFilled && isAllValidated && isEmailUnique && isRequiredChecked) {
      setIsRegisterButtonDisabled(false);
    } else {
      setIsRegisterButtonDisabled(true);
    }
  }, [isAllFilled, isAllValidated, isEmailUnique, isRequiredChecked]);

  /* -------------------------------------------------------------------------- */
  /*                               handleSubmit                                 */
  /* -------------------------------------------------------------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEnterPressed) {
      setIsEnterPressed(false);
      return;
    }

    const data = {
      name: formData.name,
      password: formData.pwd,
      passwordConfirm: formData.pwdConfirm,
      oldPassword: '7Hx9eL3Pb1NcW4Qa2Rf5', //SDK에는 optional이라 돼있는데 필수였음;;
      birth:
        formData.birth.slice(0, 4) +
        '-' +
        formData.birth.slice(4, 6) +
        '-' +
        formData.birth.slice(6, 8),
      phoneNumber: formData.phone,
      collectBook: ['9mbahw8twzvbrwr'],
    };

    if (!isVerificationButtonDisabled) {
      setSubmitModalMesseage(PLEASE_VERIFY_MESSAGE);
      setIsSubmitModalOpened(true);
      return;
    }

    try {
      const user = await pb
        .collection('users')
        .getFirstListItem(`email="${formData.email}"`);

      if (user.verified) {
        await pb.collection('users').update(user.id, data);
        setSubmitModalMesseage(GREETING_MESSEAGE);
        setIsSubmitModalOpened(true);
      } else {
        setSubmitModalMesseage(NOT_VERIFIED_MESSAGE);
        setIsSubmitModalOpened(true);
      }
    } catch (error) {
      setSubmitModalMesseage(REQUEST_FAILED_MESSAGE);
      setIsSubmitModalOpened(true);
    }
  };

  useEffect(() => {
    if (
      isSubmitModalOpened === false &&
      submitModalMesseage === GREETING_MESSEAGE
    ) {
      navigate('/Login');
    }
  });

  return {
    submitModalMesseage,
    isSubmitModalOpened,
    setIsSubmitModalOpened,
    setIsEnterPressed,
    isRegisterButtonDisabled,
    handleSubmit,
  };
}
