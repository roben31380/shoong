import { MapMarker } from 'react-kakao-maps-sdk';

export default function EventMarker({
  position,
  title,
  setCenter,
  handleClickMarker,
}) {
  return (
    <MapMarker
      position={position}
      title={title}
      onClick={() => {
        handleClickMarker(title);
        setCenter({
          center: { lat: position.lat, lng: position.lng },
          isPanto: true,
        });
      }}
    ></MapMarker>
  );
}
