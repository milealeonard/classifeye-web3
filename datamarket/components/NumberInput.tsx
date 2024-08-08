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
      className="p-1 w-full border-b-2 border-gray-500 bg-lightGray text-3xl text-black focus:outline-none w-full"
    />
  );
};
