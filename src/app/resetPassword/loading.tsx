/* eslint-disable prettier/prettier */
"use client";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function Loading() {
  return (
    <Stack
      spacing={1}
      className="relative flex flex-col items-center justify-center w-full h-screen p-14 max-w-5xl m-auto gap-10  max-[471px]:p-0 [371px]:w-full before:block before:absolute before:w-[50%] before:rounded-b-full before:h-[40%] before:top-0 before:left-0 before:bg-[#E5383B] before:z-0 after:block after:absolute after:rounded-t-full after:h-[40%] after:w-[50%] after:bottom-0 after:right-0 after:bg-[#E5383B] after:z-0"
    >
      <div className="max-[671px]:m-0 max-[671px]:h-full max-[471px]:rounded-none max-[600px]:w-full max-[600px]:justify-between z-50 backdrop-blur-3xl bg-[#2c2e3083] p-8 w-[50%] rounded-lg flex flex-col justify-between max-[771px]:w-full ">
        <Skeleton
          variant="text"
          sx={{fontSize: "1rem"}}
          height={90}
          className="bg-[#ffffff36] w-[60%]"
        />
        <div className="mt-5">
          <Skeleton
            variant="text"
            sx={{fontSize: "1rem"}}
            height={40}
            className="bg-[#ffffff36] w-[40%]"
          />
          <Skeleton
            variant="text"
            sx={{fontSize: "1rem"}}
            height={60}
            className="bg-[#ffffff36] w-full"
          />
        </div>
        <div>
          <Skeleton
            variant="text"
            sx={{fontSize: "1rem"}}
            height={40}
            className="bg-[#ffffff36] w-[40%]"
          />
          <Skeleton
            variant="text"
            sx={{fontSize: "1rem"}}
            height={60}
            className="bg-[#ffffff36] w-full"
          />
        </div>
        <div>
          <Skeleton
            variant="text"
            sx={{fontSize: "1rem"}}
            height={40}
            className="bg-[#ffffff36] w-[40%]"
          />
          <Skeleton
            variant="text"
            sx={{fontSize: "1rem"}}
            height={60}
            className="bg-[#ffffff36] w-full"
          />
        </div>
        <div className="mt-5 flex justify-center items-center flex-col">
          <Skeleton
            variant="text"
            sx={{fontSize: "1rem"}}
            height={100}
            className="bg-[#ffffff36] w-full"
          />
          <Skeleton
            variant="text"
            sx={{fontSize: "1rem"}}
            height={50}
            className="bg-[#ffffff36] w-[50%]"
          />
        </div>
      </div>
    </Stack>
  );
}
