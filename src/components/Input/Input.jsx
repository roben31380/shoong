import mergeTailwindClassNames from '@/utils/mergeTailwindClassNames';

export default function Input({
  name,
  value,
  onChange,
  type,
  placeholder,
  customClassNames = '',
  isLabeled = false,
  label,
  mt = 0,
  ...restProps
}) {
  const defaultClassNames = `h-44pxr w-265pxr rounded-[0.625rem] pl-20pxr text-sm font-medium text-contentPrimary placeholder-contentTertiary outline-none focus:outline-primary`;
  const classNames = mergeTailwindClassNames(
    customClassNames,
    defaultClassNames
  );

  return (
    <div className={`mt-${mt} flex flex-col`}>
      {isLabeled && (
        <label htmlFor={name} className="text-xs font-semibold text-primary">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className={classNames}
        {...restProps}
      />
    </div>
  );
}
