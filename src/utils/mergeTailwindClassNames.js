export default function mergeTailwindClassNames(...classNames) {
  //변수 이름이 's'로 끝나면 array, 아니면 string

  // classNames = [
  //   'w-1 h-2 text-black flex',
  //   'w-3 h-4 text-white flex-row',
  //   'w-5 h-6 text-transparent justify-between',
  // ];

  const joinedClassName = classNames.join(' ');
  // joinedClassName =
  //   'w-1 h-2 text-black flex w-3 h-4 text-white flex-row w-5 h-6 text-transparent justify-between';

  const joinedClassNames = joinedClassName.split(' ');
  // joinedClassNames = [
  //   'w-1',
  //   'h-2',
  //   'text-black',
  //   'flex',
  //   'w-3',
  //   'h-4',
  //   'text-white',
  //   'flex-row',
  //   'w-5',
  //   'h-6',
  //   'text-transparent',
  //   'justify-between',
  // ];

  const mergedClassNames = joinedClassNames.filter((className, index) => {
    if (isTextColor(className))
      return index === findTextColorIndex(joinedClassNames);
    if (isBgColor(className))
      return index === findBgColorIndex(joinedClassNames);
    if (isWidth(className)) return index === findWidthIndex(joinedClassNames);
    if (isHeight(className)) return index === findHeightIndex(joinedClassNames);
    return true;
  });
  // mergedClassNames = [
  //   'w-1',
  //   'h-2',
  //   'text-black',
  //   'flex',
  //   'flex-row',
  //   'justify-between',
  // ];

  const mergedClassName = mergedClassNames.join(' ').trim();
  // mergedClassName = 'w-1 h-2 text-black flex flex-row justify-between';

  return mergedClassName;
}

/* -------------------------------------------------------------------------- */
/*                                   colors                                   */
/* -------------------------------------------------------------------------- */
const defaultColors = [
  'inherit',
  'current',
  'transparent',
  'black',
  'white',
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
];

const customColors = Object.keys({
  primary: 'rgba(102, 98, 201, 1)',
  secondary: 'rgba(124, 120, 224, 1)',
  tertiary: 'rgba(210, 202, 250, 1)',
  negative: 'rgba(225, 25, 0, 1)',
  contentPrimary: 'rgba(32, 33, 35, 1)',
  contentSecondary: 'rgba(109, 112, 126, 1)',
  contentTertiary: 'rgba(157, 161, 180, 1)',
  gray100: 'rgba(241, 241, 241, 1)',
  gray200: 'rgba(210, 210, 210, 1)',
  gray300: 'rgba(172, 171, 173, 1)',
  gray400: 'rgba(136, 135, 137, 1)',
  gray500: 'rgba(82, 82, 82, 1)',
  gray600: 'rgba(52, 52, 52, 1)',
});

const colors = [...defaultColors, ...customColors];

/* -------------------------------------------------------------------------- */
/*                                  textcolor                                 */
/* -------------------------------------------------------------------------- */
function findTextColorIndex(classNames) {
  return classNames.findIndex(isTextColor);
}

function isTextColor(className) {
  const [property, value] = className.split('-');
  return property === 'text' && colors.includes(value); //text로 시작하는 다른 프로퍼티(textAlign, textWrap)가 있기 때문에 value가 color인지도 체크를 해줘야 됨.
}

/* -------------------------------------------------------------------------- */
/*                                   bgColor                                  */
/* -------------------------------------------------------------------------- */
function findBgColorIndex(classNames) {
  return classNames.findIndex(isBgColor);
}

function isBgColor(className) {
  const [property, value] = className.split('-');
  return property === 'bg' && colors.includes(value);
}

/* -------------------------------------------------------------------------- */
/*                                    width                                   */
/* -------------------------------------------------------------------------- */
function findWidthIndex(classNames) {
  return classNames.findIndex(isWidth);
}

function isWidth(className) {
  const [property] = className.split('-');
  return property === 'w';
}

/* -------------------------------------------------------------------------- */
/*                                    height                                   */
/* -------------------------------------------------------------------------- */
function findHeightIndex(classNames) {
  return classNames.findIndex(isHeight);
}

function isHeight(className) {
  const [property] = className.split('-');
  return property === 'h';
}
