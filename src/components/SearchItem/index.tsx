import React from "react";

function SearchItem({
  name,
  abbr,
  setConstellations,
  setSearch,
}: {
  name: string;
  abbr: string;
  setConstellations: (name: string, fullName: string) => void;
  setSearch: (name: string) => void;
}) {
  return (
    <div
      className="bg-[#3D3A3A] text-white w-full px-3 py-2 mt-2 cursor-pointer"
      onClick={() => {
        setSearch(name);
        setConstellations(abbr, name);
      }}
    >
      {name}
    </div>
  );
}

export { SearchItem };
