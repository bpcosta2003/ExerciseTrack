/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
"use client";
import supabase from "@/pages/api/supabase";
import getCookie from "@/utils/getCookie";
import {Skeleton} from "@mui/material";
import Image from "next/legacy/image";
import Link from "next/link";
import React, {useCallback, useEffect, useState} from "react";
import heartbeat from "../../public/heartbeat.gif";

export default function CardHealth() {
  const [age, setLoggedUserAge] = useState("");
  const [height, setLoggedUserHeight] = useState("");
  const [weight, setLoggedUserWeight] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [withoutData, setIsWithoutData] = useState(false);
  const [success, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const getLoggedUserData = useCallback(async (id: string) => {
    const {data, error} = await supabase
      .from("Users Health")
      .select("*")
      .eq("id", id);

    if (error) {
      setHasError(true);
      setErrorMsg(`Error loading data. ${error}`);
      return;
    }

    if (data?.length !== 0) {
      setIsSuccess(true);
      setLoggedUserAge(data?.[0]?.age);
      setLoggedUserHeight(data?.[0]?.height);
      setLoggedUserWeight(data?.[0]?.weight);
    } else {
      setIsWithoutData(true);
      setLoggedUserAge("---");
      setLoggedUserHeight("---");
      setLoggedUserWeight("---");
    }
  }, []);

  useEffect(() => {
    getLoggedUserData(getCookie());
    setIsLoading(false);
  }, [getLoggedUserData]);

  return (
    <div>
      {isLoading ? (
        <div className="transition-all bg-[#2c2e3083] rounded-xl  flex justify-between items-center h-36 max-[371px]:justify-around max-[371px]:flex-col max-[371px]:h-64">
          <div className="p-4 ml-4 flex justify-between">
            <Skeleton
              variant="circular"
              sx={{fontSize: "1rem"}}
              width={100}
              height={100}
              className="bg-[#ffffff36] w-full"
            />
          </div>
          <div className="w-[40%] p-4 pr-8 flex flex-col max-[371px]:flex-row max-[371px]:pr-4 max-[371px]:pb-12 gap-3 text-xl font-black text-end text-[#2B2D42]">
            <Skeleton
              variant="text"
              sx={{fontSize: "1rem"}}
              height={30}
              className="bg-[#ffffff36] w-full"
            />
            <Skeleton
              variant="text"
              sx={{fontSize: "1rem"}}
              height={30}
              className="bg-[#ffffff36] w-full"
            />
            <Skeleton
              variant="text"
              sx={{fontSize: "1rem"}}
              height={30}
              className="bg-[#ffffff36] w-full"
            />
          </div>
        </div>
      ) : (
        <div className="bg-[#F5F3F4] overflow-y-hidden flex-row  w-full p-4 text-[#2B2D42] text-xl gap-5 transition-all  rounded-xl  flex justify-between items-center h-36 max-[371px]:justify-around max-[371px]:flex-col max-[371px]:h-72">
          <div className="p-4 flex justify-between">
            <Image src={heartbeat} alt="health" width={150} height={150} />
          </div>
          {withoutData === false ? (
            <div className="p-4 pr-8 flex flex-col max-[371px]:flex-row max-[371px]:pr-4 max-[371px]:pb-12 gap-3 text-xl font-black text-end text-[#2B2D42]">
              <h1>{age}y</h1>
              <h1>{weight}kg</h1>
              <h1>{height}cm</h1>
            </div>
          ) : (
            <Link
              href="/myHealth"
              className=" hover:opacity-70 transition-all p-4 pr-8 flex flex-col max-[371px]:flex-row max-[371px]:pr-4 max-[371px]:pb-12 gap-3 text-xl font-black text-end "
              legacyBehavior
            >
              <h1 className="max-[371px]:text-center text-[1em] max-[471px]:text-[0.7em] hover:text-[#2b2d42a6] transition-all">
                Welcome! Insert your health information
              </h1>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
