import React, { FC } from "react";

type Props = {
  onChange: (event: any) => void;
  value: number | "";
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  fullWidth?: boolean;
};

export const NumberInput: FC<Props> = ({
  onChange,
  value,
  placeholder,
  disabled,
  fullWidth,
}) => {
  return (
    <input
      type="number"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="p-1 rounded-md border-2 border-lightBlue text-black focus:outline-none w-full"
    />
  );
};
