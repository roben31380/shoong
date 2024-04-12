import { useMeetUpStore } from '@/store/store';
import { Circle, MapMarker, useMap } from 'react-kakao-maps-sdk';

export default function EventMarker({ position, title, cafeImg, id }) {
  const map = useMap();

  const handleClickMarker = (title, marker) => {
    localStorage.setItem('selectedCafe', title);
    useMeetUpStore.setState({ selectedCafe: title });
    map.panTo(marker.getPosition());
  };

  return (
    <MapMarker
      position={position}
      title={title}
      onClick={(marker) => handleClickMarker(title, marker)}
    ></MapMarker>
  );
}
