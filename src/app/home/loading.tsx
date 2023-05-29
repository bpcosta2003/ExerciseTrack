/* eslint-disable prettier/prettier */
"use client";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function Loading() {
  return (
    <Stack
      spacing={1}
      className="transition-all z-10 before:block before:absolute before:w-[50%] before:rounded-b-full before:h-[50%] before:top-0 before:left-0 before:bg-[#E5383B] before:z-0 after:block after:absolute after:rounded-t-full after:h-[50%] after:w-[50%] after:bottom-0 after:right-0 after:bg-[#E5383B] after:z-0 flex flex-col justify-between items-center  text-white max-[600px]:flex-col h-screen "
    >
      <div className="transition-all z-50  flex flex-col justify-center w-screen h-screen p-14 max-w-7xl max-h-full m-auto gap-10 max-[671px]:p-0 max-[671px]:justify-start ">
        <div className="transition-all backdrop-blur-3xl z-50 bg-gradient-to-t from-[#2c2e303d] rounded-3xl max-[671px]:rounded-none max-[671px]:overflow-scroll ">
          <div className="p-10 flex flex-col gap-5 w-full">
            <div className="max-[671px]:sticky max-[671px]:top-0 z-[100]">
              <Skeleton
                variant="text"
                sx={{fontSize: "1rem"}}
                height={150}
                className="bg-[#ffffff36] w-full rounded-t-3xl"
              />
            </div>
            <div className="w-full gap-10 flex flex-row justify-between max-[671px]:flex-col  max-[671px]:gap-7 ">
              <Skeleton
                variant="text"
                sx={{fontSize: "1rem"}}
                height={90}
                className="bg-[#ffffff36] w-full rounded-xl"
              />
              <Skeleton
                variant="text"
                sx={{fontSize: "1rem"}}
                height={90}
                className="bg-[#ffffff36] w-[30%] rounded-xl"
              />
            </div>

            <div className="flex flex-row justify-between gap-10 max-[867px]:flex-col">
              <Skeleton
                variant="text"
                sx={{fontSize: "1rem"}}
                height={150}
                className="bg-[#ffffff36] w-full rounded-xl"
              />

              <Skeleton
                variant="text"
                sx={{fontSize: "1rem"}}
                height={150}
                className="bg-[#ffffff36] w-full rounded-xl"
              />
            </div>
            <div className="flex flex-row justify-between gap-10 max-[867px]:flex-col">
              <Skeleton
                variant="text"
                sx={{fontSize: "1rem"}}
                height={150}
                className="bg-[#ffffff36] w-full rounded-xl"
              />

              <Skeleton
                variant="text"
                sx={{fontSize: "1rem"}}
                height={150}
                className="bg-[#ffffff36] w-full rounded-xl"
              />
            </div>
            <div className="flex flex-row justify-between gap-10 max-[867px]:flex-col">
              <Skeleton
                variant="text"
                height={150}
                sx={{fontSize: "1rem"}}
                className="bg-[#ffffff36] w-full rounded-xl"
              />

              <Skeleton
                variant="text"
                sx={{fontSize: "1rem"}}
                height={150}
                className="bg-[#ffffff36] w-full rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </Stack>
  );
}
