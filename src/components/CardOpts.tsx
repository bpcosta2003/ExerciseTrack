/* eslint-disable prettier/prettier */
"use client";
import Image, {StaticImageData} from "next/legacy/image";
import React, {useState} from "react";

interface PropsCard {
  title: string;
  icon: StaticImageData;
}

export default function CardOpts({title, icon}: PropsCard) {
  const [scale, setScale] = useState(1);

  const styles = {
    transform: `scale(${scale})`,
  };

  return (
    <div
      onMouseEnter={() => setScale(1.5)}
      onMouseLeave={() => setScale(1)}
      className="shadow-lg cursor-pointer transition-all relative bg-[#E5383B] rounded-xl h-36 flex items-center justify-center hover:opacity-90 "
    >
      <div className="transition-all font-black text-3xl z-10 max-[371px]:text-xl">
        <h1>{title}</h1>
      </div>
      <div style={styles} className=" transition-all absolute opacity-10 z-0">
        <Image
          src={icon}
          alt={title}
          width={70}
          height={70}
          className="transition-all"
        />
      </div>
    </div>
  );
}
