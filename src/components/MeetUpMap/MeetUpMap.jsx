import EventMarker from './EventMarker';
import { useEffect, useState } from 'react';
import { TbCurrentLocation } from 'react-icons/tb';
import { useMeetUpStore, meetUpDataStore } from '@/store/store';
import {
  CustomOverlayMap,
  Map,
  MapMarker,
  ZoomControl,
} from 'react-kakao-maps-sdk';

export default function MeetUpMap({ meetUpData }) {
  const { setMeetUpData } = meetUpDataStore();
  const [newMeetUpData, setNewMeetUpData] = useState(meetUpData);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 37.556944,
    lng: 126.923917,
  });

  const handleClickMarker = (title) => {
    localStorage.setItem('selectedCafe', title);
    useMeetUpStore.setState({ selectedCafe: title });
  };

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

  useEffect(() => {
    if (userLocation) {
      // 사용자의 현재 위치로 지도 중심을 이동합니다.
      setMapCenter(userLocation);
    }
  }, [userLocation]);

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          // 사용자 위치를 상태에 저장합니다.
          setUserLocation(currentLocation);
        },
        (error) => {
          console.error(error);
          alert('위치 정보를 가져오는 데 실패했습니다.');
        }
      );
    } else {
      // Geolocation API를 지원하지 않는 경우의 처리
      alert('이 브라우저에서는 Geolocation이 지원되지 않습니다.');
    }
  };

  return (
    <Map
      center={mapCenter}
      isPanto={true}
      className="relative h-full w-full"
      level={5}
    >
      <ZoomControl />
      {newMeetUpData.map((data) => {
        return (
          data.coords && (
            <div
              className="border border-red-50 shadow-md"
              key={data.id}
              onClick={() => handleClickMarker(data.cafeName)}
            >
              {userLocation && (
                <MapMarker
                  position={userLocation}
                  image={{
                    src: '/icons/marker.svg',
                    size: { width: 40, height: 40 },
                    options: {
                      alt: '내 위치',
                    },
                  }}
                />
              )}
              <EventMarker
                position={data.coords}
                title={data.cafeName}
                cafeImg={data.cafeImg[0]}
                handleClickMarker={handleClickMarker}
                id={data.id}
                onClick={() =>
                  handleClickMarker(data.coords.lat, data.coords.lng)
                }
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
      <TbCurrentLocation
        className="absolute bottom-150pxr left-6 z-20 h-10 w-10 rounded-full border border-primary bg-white px-1 py-1 text-primary hover:cursor-pointer"
        onClick={handleCurrentLocation}
      />
    </Map>
  );
}
