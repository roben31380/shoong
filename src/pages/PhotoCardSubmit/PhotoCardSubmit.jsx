import React, { useState } from 'react';
import DetailHeader from '@/components/DetailHeader/DetailHeader';

export default function PhotoCardSubmit() {
  const [image, setImage] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [memberName, setMemberName] = useState('');
  const [cardType, setCardType] = useState('');
  const [cardName, setCardName] = useState('');

  const groups = ['뉴진스', 'bts', '블랙핑크'];

  const handleFileChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleGroupSelect = (groupName) => {
    setSelectedGroup(groupName);
  };

  const handleCardTypeSelect = (type) => {
    setCardType(type);
  };

  const isSubmitEnabled =
    image && selectedGroup && memberName && cardType && cardName;

  return (
    <div className="flex w-full flex-col items-center pb-24 pt-6">
      <DetailHeader title="제보하기" />
      <h1 className="mb-8 pb-4 pt-16 text-center text-xl font-b03 text-gray600">
        포토카드를 등록해 주세요!
      </h1>
      <div className="mb-8">
        <label className=" flex h-96 w-64 cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-200 text-center leading-normal">
          {image ? (
            <img
              src={image}
              alt="Uploaded"
              className="h-full w-full rounded-lg object-contain"
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
      {isSubmitEnabled && (
        <button className="rounded-lg bg-primary px-4 py-2 text-white">
          확인
        </button>
      )}
    </div>
  );
}
