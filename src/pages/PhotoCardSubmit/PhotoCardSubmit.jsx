import React, { useState } from 'react';
import pb from '@/api/pocketbase';
import DetailHeader from '@/components/DetailHeader/DetailHeader';

export default function PhotoCardSubmit() {
  const [image, setImage] = useState(null); // 사용자가 업로드한 이미지 파일
  const [selectedGroup, setSelectedGroup] = useState(''); // 선택된 그룹
  const [memberName, setMemberName] = useState(''); // 입력된 멤버 이름
  const [cardType, setCardType] = useState(''); // 선택된 카드 종류
  const [cardName, setCardName] = useState(''); // 입력된 카드 이름

  const groups = ['뉴진스', 'bts', '블랙핑크']; // 예시 그룹 리스트

  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // 파일 객체를 직접 저장
    // URL.createObjectURL 사용하여 미리보기 생성하지 않고, 파일 객체 저장
  };

  const handleGroupSelect = (groupName) => {
    setSelectedGroup(groupName);
  };

  const handleCardTypeSelect = (type) => {
    setCardType(type);
  };

  const isSubmitEnabled =
    image && selectedGroup && memberName && cardType && cardName;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('auth')).user;
      const userId = userInfo.id; // 사용자 ID

      const formData = new FormData();
      formData.append('user', userId);
      formData.append('type', 'phoca');
      formData.append('group', selectedGroup);
      formData.append('artistName', memberName);
      formData.append('phocaType', cardType);
      formData.append('phocaTitle', cardName);
      formData.append('phocaImg', image); // 이미지 파일 추가

      // PocketBase에 데이터 전송
      await pb.collection('informUs').create(formData);

      alert('포토카드가 성공적으로 등록되었습니다.');
    } catch (error) {
      console.error('포토카드 제출 중 오류가 발생했습니다:', error);
      alert('포토카드 제출 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex w-full flex-col items-center pb-24 pt-6">
      <DetailHeader title="제보하기" />
      <h1 className="mb-8 pb-4 pt-16 text-center text-xl font-b03 text-gray600">
        포토카드를 등록해 주세요!
      </h1>
      <div className="mb-8">
        <label className="flex h-96 w-64 cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-200 text-center leading-normal">
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Uploaded"
              className="h-full w-full rounded-lg object-cover object-center"
            />
          ) : (
            <div className="flex flex-col">
              <span className="text-xl text-gray400">+</span>
              <span className="text-gray400">포토카드 이미지 첨부</span>
            </div>
          )}
          <input type="file" onChange={handleFileChange} className="hidden" />
        </label>
      </div>
      {image && (
        <>
          <h2 className="mb-4 pb-4 pt-8 text-center text-sb03 font-sb03">
            어떤 그룹인가요?
          </h2>
          <div className="mb-8 flex items-center justify-center overflow-x-auto">
            {groups.map((group) => (
              <button
                key={group}
                onClick={() => handleGroupSelect(group)}
                className={`mx-2 rounded-full border ${
                  selectedGroup === group
                    ? 'bg-secondary text-white'
                    : 'border-primary bg-white text-primary'
                } px-4 py-2`}
              >
                {group}
              </button>
            ))}
          </div>
        </>
      )}
      {selectedGroup && (
        <>
          <h2 className="mb-4 pb-4 pt-8 text-center text-sb03 font-sb03">
            멤버 이름을 알려주세요
          </h2>
          <input
            type="text"
            placeholder="멤버 이름"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            className="mb-8 w-80 border-b-2 border-gray-300 bg-white p-2"
          />
        </>
      )}
      {memberName && (
        <>
          <h2 className="mb-4 pb-4 pt-8 text-center text-sb03 font-sb03">
            카드 종류가 무엇인가요?
          </h2>
          <div className="mb-8 flex justify-center space-x-4">
            {['앨범', '특전', '팬싸', '시즌그리팅', '기타'].map((type) => (
              <button
                key={type}
                onClick={() => handleCardTypeSelect(type)}
                className={`rounded-full border ${
                  cardType === type
                    ? 'bg-secondary text-white'
                    : 'border-primary bg-white text-primary'
                } px-4 py-2`}
              >
                {type}
              </button>
            ))}
          </div>
        </>
      )}
      {cardType && (
        <>
          <h2 className="mb-4 pb-4 pt-8 text-center text-sb03 font-sb03">
            포토카드 이름을 알려주세요
          </h2>
          <input
            type="text"
            placeholder="포토카드 이름"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className="mb-8 w-80 border-b-2 border-gray-300 bg-white p-2"
          />
        </>
      )}
      <form onSubmit={handleSubmit}>
        {isSubmitEnabled && (
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-white"
          >
            확인
          </button>
        )}
      </form>
    </div>
  );
}
