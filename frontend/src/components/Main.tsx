import React from "react";
import { Vortex } from "./ui/Vortex";
import { Link } from "react-router-dom";

function Main() {
  return (
    <div className="w-full flex flex-col items-center justify-center m-3 p-2 mt-16 md:mt-24 ">
      <div className="relative z-10 flex flex-col items-center justify-center">
        <h1 className="text-6xl md:text-6xl lg:text-[110px]  font-bold max-w-5xl md:text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
          NEW WAY TO GENERATE
        </h1>

        <div className="mt-14">
          <Link to="/generate">
            <button className="relative inline-flex h-12 active:scale-95 transistion overflow-hidden rounded-full p-[1px] focus:outline-none">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#e7029a_0%,#f472b6_50%,#bd5fff_100%)]"></span>
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-10 text-sm font-medium text-white backdrop-blur-3xl gap-2 undefined">
                Generate ✨
              </span>
            </button>
          </Link>
        </div>
      </div>
      <div className="mt-28 pt-24 hidden md:block">
        <Vortex />
      </div>
    </div>
  );
}

export default Main;
