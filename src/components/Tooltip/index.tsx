import React from "react";
import { createPortal } from "react-dom";

function Tooltip({
  id,
  name,
  show,
}: {
  id: string;
  name: string;
  show: boolean;
}) {
  return createPortal(
    <div
      className={` ${
        show ? "visible opacity-100" : " invisible opacity-0"
      } absolute bg-[#242121] text-sm p-2 text-white w-fit whitespace-nowrap bottom-3 z-30 left-1/2 rounded-lg rounded-bl-none transition-all duration-200`}
    >
      {name}
    </div>,
    document.getElementById(id) || document.body
  );
}

export { Tooltip };
