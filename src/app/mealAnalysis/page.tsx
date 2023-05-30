/* eslint-disable prettier/prettier */
"use client";
import Button from "@/components/Button";
import CardGoal from "@/components/CardGoal";
import Link from "next/link";
import React from "react";
import plus from "../../../public/add.gif";
import back from "../../../public/arrowback.gif";

export default function myGoals() {
  return (
    <div className="transition-all relative z-10 before:block before:absolute before:w-[50%] before:rounded-t-full before:h-[50%] before:bottom-0 before:left-0 before:bg-[#E5383B] before:z-0 after:block after:absolute after:rounded-b-full after:h-[50%] after:w-[50%] after:top-0 after:right-0 after:bg-[#E5383B] after:z-0 flex flex-col justify-between items-center  text-[#161A1D] max-[600px]:flex-col h-screen">
      <div className="transition-all backdrop-blur-3xl z-50 m-10  bg-[#2c2e3083] text-white w-[50%] max-[1024px]:w-[80%] max-[1024px]:overflow-scroll rounded-t-3xl rounded-xl max-[600px]:rounded-none max-[600px]:w-full h-screen flex flex-col gap-5 max-[671px]:m-0 justify-start">
        <div className="bg-[#2c2e30a9] backdrop-blur-[100px] w-full  rounded-t-3xl max-[671px]:rounded-t-none flex flex-col justify-between items-start p-10 gap-5">
          <h1 className="text-5xl font-black ">Meals</h1>
        </div>

        <div className="p-10">
          <div className="overflow-scroll overflow-x-hidden flex flex-col h-[50vh]">
            <CardGoal />
          </div>
        </div>

        <div className="flex flex-row gap-5 justify-between max-[688px]:flex-col w-full p-10 mt-auto">
          <Link href="/home" className="z-10 w-full" legacyBehavior>
            <div className="z-50  w-full">
              <Button text="Back" icon={back} type="red" />
            </div>
          </Link>
          <Link href="/createGoal" className="z-10 w-full" legacyBehavior>
            <div className="z-50  w-full">
              <Button text="Create Goal" icon={plus} type="white" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
