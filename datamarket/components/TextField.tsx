import React, { FC } from "react";
import { text } from "stream/consumers";

type Props = {
  onChange: (event: any) => void;
  value?: string;
  onKeyDown?: (event: any) => void;
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  fullWidth?: boolean;
  textSize?: string;
};

export const TextField: FC<Props> = ({
  onChange,
  value,
  onKeyDown,
  placeholder,
  disabled,
  multiline,
  fullWidth,
  textSize,
}) => {
  let className =
    "p-1 bg-lightGray w-full text-black focus:outline-none " + textSize;
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
