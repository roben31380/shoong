import mergeTailwindClassNames from '@/utils/mergeTailwindClassNames';

// 버튼 컴포넌트
export default function Button({
  type = 'button',
  isSmall,
  isDisabled,
  customClassNames = '',
  children,
  onClick,
  ...restProps
}) {
  let width, height, fontWeight;
  if (isSmall) {
    (width = 'w-69pxr'), (height = 'h-28pxr'), (fontWeight = 'medium');
  } else {
    (width = 'w-265pxr'), (height = 'h-44pxr'), (fontWeight = 'semibold');
  }

  const backgroundColor = isDisabled ? 'bg-gray-400' : 'bg-primary';

  const defaultClassNames = `${width} ${height} ${fontWeight} ${backgroundColor} rounded-[10px] text-sm text-white`;

  const classNames = mergeTailwindClassNames(
    customClassNames,
    defaultClassNames
  );

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={isDisabled}
      {...restProps}
    >
      {children}
    </button>
  );
}
