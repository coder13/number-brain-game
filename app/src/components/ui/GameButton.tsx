import classNames from "classnames";
import React from "react";

export const GameButton = ({
  className,
  children,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  return (
    <button
      className={classNames(
        "py-2 px-4 text-4xl font-bold cursor-pointer bg-[#00bef3] text-white rounded-lg border-2 border-[#00bef3] hover:bg-opacity-90",
        className
      )}
      style={{
        boxShadow: "-0.25em 0.25em #02607a",
      }}
      {...props}
      // onClick={handleStart}
      // disabled={!roomState?.users.length || roomState?.users.length <= 1}
    >
      <span className="drop-shadow-lg ">{children}</span>
    </button>
  );
};
