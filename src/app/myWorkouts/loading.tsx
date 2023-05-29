/* eslint-disable prettier/prettier */
"use client";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function Loading() {
  return (
    <Stack
      spacing={1}
      className="transition-all relative z-10 before:block before:absolute before:w-[50%] before:rounded-t-full before:h-[50%] before:bottom-0 before:left-0 before:bg-[#E5383B] before:z-0 after:block after:absolute after:rounded-b-full after:h-[50%] after:w-[50%] after:top-0 after:right-0 after:bg-[#E5383B] after:z-0 flex flex-col justify-between items-center  text-[#161A1D] max-[600px]:flex-col h-screen"
    >
      <div className="transition-all backdrop-blur-3xl z-50 m-10 max-[671px]:m-0 p-10 bg-[#2c2e3083] text-white w-[50%] max-[1024px]:w-[70%] max-[1024px]:overflow-scroll rounded-xl max-[600px]:rounded-none max-[600px]:w-full h-screen flex flex-col gap-10 justify-start">
        <Skeleton
          variant="text"
          sx={{fontSize: "1rem"}}
          height={60}
          className="bg-[#ffffff36] w-[40%]"
        />

        <div className="flex flex-col gap-5 overflow-scroll overflow-x-hidden mt-auto">
          <Skeleton
            variant="text"
            sx={{fontSize: "1rem"}}
            height={120}
            className="bg-[#ffffff36]"
          />
          <Skeleton
            variant="text"
            sx={{fontSize: "1rem"}}
            height={120}
            className="bg-[#ffffff36] "
          />
          <Skeleton
            variant="text"
            sx={{fontSize: "1rem"}}
            height={120}
            className="bg-[#ffffff36]"
          />
          <Skeleton
            variant="text"
            sx={{fontSize: "1rem"}}
            height={120}
            className="bg-[#ffffff36]"
          />
        </div>

        <div className="flex flex-row gap-5 justify-between max-[486px]:flex-col">
          <Skeleton
            variant="text"
            sx={{fontSize: "1rem"}}
            height={70}
            className="bg-[#ffffff36] w-[40%]"
          />
          <Skeleton
            variant="text"
            sx={{fontSize: "1rem"}}
            height={70}
            className="bg-[#ffffff36] w-[40%]"
          />
        </div>
      </div>
    </Stack>
  );
}
