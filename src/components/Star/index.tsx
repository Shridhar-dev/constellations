import React, { useState } from "react";
import { Tooltip } from "../";

function Star({
  id,
  top,
  left,
  scaler,
  name,
  dimensions,
}: {
  id: string;
  top: number;
  left: number;
  scaler: number;
  name: string;
  dimensions: { height: number; width: number };
}) {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  return (
    <div
      id={id}
      onMouseEnter={() => {
        setShowTooltip(true);
      }}
      onMouseLeave={() => {
        setShowTooltip(false);
      }}
      className="h-3 w-3 star transition duration-200 rounded-full border border-white border-1 bg-black  absolute  hover:bg-white"
      style={{
        top: top / scaler + dimensions.height / 2,
        left: (left / scaler) * 15 + dimensions.width / 3,
        bottom: "20px",
      }}
    >
      <Tooltip id={id} name={name} show={showTooltip} />
    </div>
  );
}

export { Star };
