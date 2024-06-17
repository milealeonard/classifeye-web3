import React, { FC } from "react";

type Props = {
  children: React.ReactElement | string;
  onClick: () => void;
  color?: string;
  disabled?: boolean;
};

export const Button: FC<Props> = ({ children, onClick, color, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ color: color }}
      className="p-2 border rounded-md"
    >
      {children}
    </button>
  );
};
