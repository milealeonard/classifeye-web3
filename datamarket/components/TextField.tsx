import React, { FC } from "react";

type Props = {
  onChange: (event: any) => void;
  value?: string;
  onKeyDown?: (event: any) => void;
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  fullWidth?: boolean;
};

export const TextField: FC<Props> = ({
  onChange,
  value,
  onKeyDown,
  placeholder,
  disabled,
  multiline,
  fullWidth,
}) => {
  let className =
    "p-1 bg-lightGray w-full text-black text-3xl focus:outline-none";
  if (fullWidth) {
    className = className.concat(" w-full");
  }

  if (multiline) {
    return (
      <textarea
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        value={value}

      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
    />
  );
};
