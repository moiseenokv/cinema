import { useState } from 'react';
import s from './TextField.module.scss';

type Props = {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  error?: string;
  touched?: boolean;
  autoComplete?: string;
  placeholder?: string;
  underline?: boolean; // включить макетную "линию"
};

export function TextField({
  label, name, type = 'text', value, onChange, onBlur, onFocus,
  error, touched, autoComplete, placeholder, underline = true,
}: Props) {
  const hasError = Boolean(touched && error);
  const [focused, setFocused] = useState(false);

  const rootClass = [
    s.field,
    hasError ? s.fieldError : '',
    focused && !hasError ? s.fieldFocus : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={rootClass}>
      <label className={s.fieldLabel} htmlFor={name}>{label}</label>

      <div className={s.fieldUnderlined}>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          onFocus={(e) => { setFocused(true);  onFocus?.(e); }}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={s.fieldInput}
        />
        {underline && <div className={s.fieldLine} />}
      </div>

      {hasError && <div className={s.fieldHint}>{error}</div>}
    </div>
  );
}
