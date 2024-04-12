import { useEffect, useState } from 'react';
import { CustomOverlayMap, Map, ZoomControl } from 'react-kakao-maps-sdk';
import EventMarker from './EventMarker';
import { useMeetUpStore, meetUpDataStore } from '@/store/store';

export default function MeetUpMap({ meetUpData }) {
  const { setMeetUpData } = meetUpDataStore();
  const [newMeetUpData, setNewMeetUpData] = useState(meetUpData);

  useEffect(() => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    const addressSearchPromises = meetUpData.map(
      (data) =>
        new Promise((resolve, reject) => {
          geocoder.addressSearch(data.address, function (result, status) {
            if (status === window.kakao.maps.services.Status.OK) {
              const coords = new window.kakao.maps.LatLng(
                result[0].y,
                result[0].x
              );
              resolve({ lat: coords.getLat(), lng: coords.getLng() });
            } else {
              reject(new Error('AddressSearch failed'));
            }
          });
        })
    );

    Promise.all(addressSearchPromises)
      .then((positions) => {
        // meetUpData의 각 항목에 위도와 경도를 추가
        const updatedMeetUpData = meetUpData.map((data, index) => {
          return { ...data, coords: positions[index] };
        });
        setNewMeetUpData(updatedMeetUpData);
        setMeetUpData(updatedMeetUpData);
        localStorage.setItem('meetupData', JSON.stringify(updatedMeetUpData));
      })
      .catch((error) => console.error(error));
  }, [meetUpData, setMeetUpData]);

  const handleClickMarker = (title) => {
    localStorage.setItem('selectedCafe', title);
    useMeetUpStore.setState({ selectedCafe: title });
  };

  return (
    <Map
      center={{ lat: 37.556944, lng: 126.923917 }}
      className="relative h-full w-full"
      level={5}
      onZoomChanged={(map) => {
        const level = map.getLevel();
      }}
    >
      <ZoomControl />
      {newMeetUpData.map((data) => {
        console.log(data);
        return (
          data.coords && (
            <div
              className="border border-red-50 shadow-md"
              key={data.id}
              onClick={() => handleClickMarker(data.cafeName)}
            >
              <EventMarker
                position={data.coords}
                title={data.cafeName}
                cafeImg={data.cafeImg[0]}
                id={data.id}
              />
              <CustomOverlayMap position={data.coords} yAnchor={1}>
                <div className="group relative h-60pxr w-60pxr cursor-pointer">
                  {/* 이미지를 원형으로 만듭니다 */}
                  <img
                    src={`https://shoong.pockethost.io/api/files/meetUps/${data.id}/${data.artistImg}`}
                    alt={data.cafeName}
                    className="absolute left-0.5 top-1.5 z-10 h-55pxr w-55pxr rounded-full object-cover group-hover:scale-110"
                  />
                  <img
                    src="/icons/markerBorder.png"
                    alt=""
                    className="markerBorder group-hover:scale-110"
                  />
                  <span className="absolute bottom-62pxr hidden rounded-md border border-primary bg-white px-2 font-semibold text-primary group-hover:block">
                    {data.artistName}
                  </span>
                </div>
              </CustomOverlayMap>
            </div>
          )
        );
      })}
    </Map>
  );
}
