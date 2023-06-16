/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import StartRoundedIcon from "@mui/icons-material/StartRounded";
import {StaticImageData} from "next/image";
import Image from "next/legacy/image";
import React, {useState} from "react";
import caloriesImg from "../../public/calories.png";
import carbohydratesImg from "../../public/carbohydrates.png";
import fatImg from "../../public/fat.png";
import proteinImg from "../../public/protein.png";

interface PropsCard {
  image: StaticImageData | string | undefined;
  nutrientName: string | undefined;
  nutrientValue: number | undefined;
  functionNextStep: () => void;
  nextNutrientImage: StaticImageData | string | undefined;
  nextNutrientName: string | undefined;
}

export default function NutrientsInfos({
  image,
  nutrientName,
  nutrientValue,
  functionNextStep,
  nextNutrientImage,
  nextNutrientName,
}: PropsCard) {
  return (
    <div className="transition-all relative flex flex-row justify-between items-center gap-5 w-full max-2ssm:flex-col">
      <div className="p-4 flex flex-row items-center gap-3 justify-between ">
        <Image
          src={image as StaticImageData}
          alt={nutrientName}
          width={100}
          height={100}
        />
      </div>
      <p className=" absolute bottom-0 right-0 text-[4.5rem] max-2ssm:right-auto max-2ssm:text-[2.5rem] opacity-20 p-3 mb-4 rounded-full  ">
        {nutrientName}
      </p>
      <div className="flex flex-col justify-end items-end gap-10 w-full mt-[1.5rem]">
        <h1 className="text-end w-full text-[3em] mr-10 mb-[5rem] max-2ssm:text-center max-2ssm:mr-0 max-2ssm:text-[2em]">
          {nutrientValue?.toFixed(1)}
          {nutrientName === "Cal." ? "" : "g"}
        </h1>

        <div className="absolute w-full flex items-center justify-start max-2ssm:justify-center bottom-0 left-0 mr-10 max-2ssm:top-20 max-2ssm:bottom-auto max-2ssm:ml-auto max-2ssm:mr-auto">
          <button
            onClick={functionNextStep}
            type="button"
            className="  shadow-lg transition-all bg-[#2c2e30] text-[#8a8a8aa3] hover:text-[#ffffffa2]   p-2 pl-4 pr-4 rounded-full flex flex-row gap-2 justify-between items-center"
          >
            <h1 className="text-sm font-light ">Next </h1>
            <StartRoundedIcon />
            <Image
              src={nextNutrientImage as StaticImageData}
              alt={nextNutrientName}
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
