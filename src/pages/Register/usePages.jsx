import { useEffect, useMemo, useState } from 'react';

export default function usePages(
  formData,
  isValidatedList,
  isEmailUnique,
  isVerificationButtonDisabled,
  isRequiredChecked
) {
  const registerPages = useMemo(
    () => ['agree', 'email', 'pwd', 'name', 'phone', 'birth'],
    []
  ); //이렇게 쓰는 거 맞는지 확인 필요 (eslint가 하래서 함)

  const totalPageLength = registerPages.length;

  const [currentPageNumber, setCurrentPageNumber] = useState(0);

  const progressBarWidth = `${(265 * (currentPageNumber / (totalPageLength - 1))) / 16}rem`;

  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(
    registerPages.reduce((acc, cur) => {
      acc[cur] = true;
      return acc;
    }, {})
  );

  const handleNextButton = (e) =>
    setCurrentPageNumber((currentPageNumber) => currentPageNumber + 1);

  const handlePreviousButton = (e) =>
    setCurrentPageNumber((currentPageNumber) => currentPageNumber - 1);

  useEffect(() => {
    /* -------------------------------------------------------------------------- */
    /*                  필수항목 다 동의체크 되면 다음 버튼 활성화                          */
    /* -------------------------------------------------------------------------- */
    if (isRequiredChecked) {
      setIsNextButtonDisabled((isNextButtonDisabled) => ({
        ...isNextButtonDisabled,
        ['agree']: false,
      }));
    } else {
      setIsNextButtonDisabled((isNextButtonDisabled) => ({
        ...isNextButtonDisabled,
        ['agree']: true,
      }));
    }

    /* -------------------------------------------------------------------------- */
    /*          이메일 유효하고, 유일하고, 인증하기 버튼 클릭했으면 다음 버튼 활성화              */
    /* -------------------------------------------------------------------------- */
    if (
      formData['email'] !== '' &&
      isValidatedList['email'] &&
      isEmailUnique &&
      isVerificationButtonDisabled
    ) {
      setIsNextButtonDisabled((isNextButtonDisabled) => ({
        ...isNextButtonDisabled,
        ['email']: false,
      }));
    } else {
      setIsNextButtonDisabled((isNextButtonDisabled) => ({
        ...isNextButtonDisabled,
        ['email']: true,
      }));
    }

    /* -------------------------------------------------------------------------- */
    /*         비밀번호, 비밀번호 재확인 모두 채워져 있고 유효하면 다음 버튼 활성화               */
    /* -------------------------------------------------------------------------- */
    if (
      formData['pwd'] !== '' &&
      formData['pwdConfirm'] !== '' &&
      isValidatedList['pwd'] &&
      isValidatedList['pwdConfirm']
    ) {
      setIsNextButtonDisabled((isNextButtonDisabled) => ({
        ...isNextButtonDisabled,
        ['pwd']: false,
      }));
    } else {
      setIsNextButtonDisabled((isNextButtonDisabled) => ({
        ...isNextButtonDisabled,
        ['pwd']: true,
      }));
    }

    /* -------------------------------------------------------------------------- */
    /*                  나머지 두 페이지(이름, 휴대폰)은 반복이라 forEach                   */
    /* -------------------------------------------------------------------------- */
    registerPages.slice(3, 5).forEach((page) => {
      if (formData[page] !== '' && isValidatedList[page]) {
        setIsNextButtonDisabled((isNextButtonDisabled) => ({
          ...isNextButtonDisabled,
          [page]: false,
        }));
      } else {
        setIsNextButtonDisabled((isNextButtonDisabled) => ({
          ...isNextButtonDisabled,
          [page]: true,
        }));
      }
    });
  }, [
    isRequiredChecked,
    formData,
    isValidatedList,
    isEmailUnique,
    isVerificationButtonDisabled,
    registerPages, //이건 그냥 상수인데 eslint에서 dependency로 넣으라 그래서 넣음
  ]);

  return {
    progressBarWidth,
    registerPages,
    currentPageNumber,
    isNextButtonDisabled,
    handleNextButton,
    handlePreviousButton,
  };
}
