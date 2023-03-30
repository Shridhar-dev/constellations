import React from "react";

function SearchItem({
  name,
  abbr,
  setConstellations,
}: {
  name: string;
  abbr: string;
  setConstellations: (name: string) => void;
}) {
  return (
    <div
      className="bg-gray-800 text-white w-full px-3 py-2 mt-2 cursor-pointer"
      onClick={() => {
        setConstellations(abbr);
      }}
    >
      {name}
    </div>
  );
}

export default SearchItem;
