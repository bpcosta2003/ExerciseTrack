/* eslint-disable prettier/prettier */
"use client";
import Image, {StaticImageData} from "next/legacy/image";
import React, {useState} from "react";

interface PropsButton {
  text: string;
  icon?: StaticImageData;
  type: string;
}

export default function Button({text, icon, type}: PropsButton) {
  const [createHover, setCreateHover] = useState(false);

  return (
    <div className="w-full ">
      {type === "white" ? (
        <div
          onMouseEnter={() => setCreateHover(true)}
          onMouseLeave={() => setCreateHover(false)}
          className=" relative bg-[#F5F3F4] rounded-xl hover:opacity-90   w-[100%] transition-all  flex justify-center items-center"
        >
          {createHover ? (
            <button className="  w-[100%] flex flex-row  justify-center items-center gap-4 p-5 text-xl font-bold uppercase">
              {icon ? (
                <div className="absolute opacity-100 z-0 transition-all rotate-180 flex items-center">
                  <Image src={icon} alt={text} width={50} height={50} />
                </div>
              ) : (
                ""
              )}
              <h1 className="text-[#2B2D42] opacity-0 transition-all max-[471px]:text-[0.6em]">
                {text}
              </h1>
            </button>
          ) : (
            <button className="  w-[100%]  flex flex-row  justify-center items-center gap-4 p-5 text-xl font-bold uppercase">
              {icon ? (
                <div className="absolute opacity-0 z-0 transition-all flex items-center">
                  <Image src={icon} alt={text} width={50} height={50} />
                </div>
              ) : (
                ""
              )}
              <h1 className="text-[#2B2D42] opacity-100 transition-all max-[471px]:text-[0.6em]">
                {text}
              </h1>
            </button>
          )}
        </div>
      ) : (
        <div
          onMouseEnter={() => setCreateHover(true)}
          onMouseLeave={() => setCreateHover(false)}
          className=" relative bg-[#E5383B] rounded-xl hover:opacity-90  transition-all w-[100%] flex justify-center items-center"
        >
          {createHover ? (
            <button className=" w-[100%] flex flex-row  justify-center items-center gap-4 p-5 text-xl font-bold uppercase">
              {icon ? (
                <div className="absolute opacity-100 z-0 transition-all rotate-180 flex items-center">
                  <Image src={icon} alt={text} width={50} height={50} />
                </div>
              ) : (
                ""
              )}
              <h1 className="text-[#F5F3F4] opacity-0 transition-all max-[471px]:text-[0.6em]">
                {text}
              </h1>
            </button>
          ) : (
            <button className=" w-[100%] flex flex-row  justify-center items-center gap-4 p-5 text-xl font-bold uppercase">
              {icon ? (
                <div className="absolute opacity-0 z-0 transition-all flex items-center">
                  <Image src={icon} alt={text} width={50} height={50} />
                </div>
              ) : (
                ""
              )}
              <h1 className="text-[#F5F3F4] opacity-100 transition-all max-[471px]:text-[0.6em]">
                {text}
              </h1>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
