import React, { FC } from "react";

type Props = {
  children: React.ReactElement | string;
  onClick: () => void;
  color?: string;
  disabled?: boolean;
  padding?: "p-1" | "p-2";
  removeOutline?: boolean;
};

export const Button: FC<Props> = ({
  children,
  onClick,
  color,
  disabled,
  padding = "p-2",
  removeOutline,
}) => {
  let buttonClassName = `rounded-md disabled:text-gray-500 disabled:border-gray-500 focus:outline-none ${padding}`;
  if (!removeOutline) {
    buttonClassName = buttonClassName.concat(" border-2 border-lightBlue");
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ color: color }}
      className={buttonClassName}
    >
      {children}
    </button>
  );
};
