import { StaticMap } from 'react-kakao-maps-sdk';

export default function MeetUpDetailMap({ meetUpData }) {
  return (
    <StaticMap
      className="mx-auto h-full min-h-120pxr w-full rounded-xl object-cover shadow-meetUp"
      center={meetUpData.coords}
      level={3}
      zoomable={false}
      marker={[
        {
          position: {
            lat: meetUpData.coords.lat,
            lng: meetUpData.coords.lng,
          },
          text: `${meetUpData.cafeName}`,
        },
      ]}
    ></StaticMap>
  );
}
