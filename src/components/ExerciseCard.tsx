/* eslint-disable no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable prettier/prettier */
"use client";
import getExerciseApi from "@/utils/getExerciseApi";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import Image from "next/legacy/image";
import React, {useCallback, useState} from "react";
import info from "../../public/info.gif";

interface PropsExerciseCard {
  bodyPart?: string;
  equipment?: string;
  gifUrl?: string;
  id?: string;
  name: string;
  target?: string;
  type?: string;
  muscle?: string;
  difficulty?: string;
  instructions?: string;
}

export default function ExerciseCard({
  bodyPart,
  equipment,
  gifUrl,
  id,
  name,
  target,
  type,
  muscle,
  difficulty,
  instructions,
}: PropsExerciseCard) {
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const [actualExercise, setActualExercise] = useState("");
  const handleOpen = () => {
    setOpen(true);
    generateResponseName(id || name);
  };
  const handleClose = () => setOpen(false);

  const generateResponseName = useCallback(async (id: string) => {
    const response = await getExerciseApi("get_by_name", "", id);
    setActualExercise(response);
  }, []);

  return (
    <>
      <div
        className=" shadow-lg relative bg-[#F5F3F4] w-56 h-56 max-ssm:w-48 max-ssm:h-48 rounded-t-lg transition-all overflow-hidden"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {gifUrl ? (
          <div className="transition-all absolute w-56 h-56 max-ssm:w-48 max-ssm:h-48 rounded-t-lg flex items-center justify-center">
            <Image
              src={`${gifUrl}`}
              alt="gifExercise"
              width={224}
              height={224}
              className="rounded-lg"
            />
          </div>
        ) : (
          <div className="text-black absolute transition-all w-56 h-full max-ssm:w-48 max-ssm:h-full rounded-t-lg flex items-center justify-center p-2">
            <p className="text-center">{name}</p>
          </div>
        )}

        {hover ? (
          <button
            type="button"
            onClick={handleOpen}
            className="transition-all hover:bg-[#2b2d4270] backdrop-blur-sm absolute w-56 h-56 max-ssm:w-48 max-ssm:h-48 rounded-t-lg flex items-center justify-center"
          >
            <Image src={info} alt="remove" width={100} height={100} />
          </button>
        ) : (
          ""
        )}
      </div>
      {actualExercise ? (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className="absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2 max-w-[30rem] backdrop-blur-3xl bg-[#2c2e30a6] shadow-lg flex flex-col justify-between items-start gap-4 rounded-t-lg max-2ssm:rounded-t-[0] rounded-b-lg max-2ssm:rounded-b-[0] max-lg:w-[80%] max-2ssm:w-full text-[#adadad] p-5">
              <div className="transition-all w-full h-56 rounded-lg flex items-center justify-center ">
                {gifUrl ? (
                  <img
                    src={`${gifUrl}`}
                    alt="gifExercise"
                    className="rounded-lg w-full max-2ssm:rounded-t-[0]"
                  />
                ) : (
                  <div className="rounded-lg w-full h-full max-2ssm:rounded-t-[0] overflow-y-scroll overflow-x-hidden">
                    <p>{instructions}</p>
                  </div>
                )}
              </div>
              <div className="  max-2ssm:rounded-b-[0] flex flex-col gap-5 w-full">
                <div className="flex flex-col gap-5 justify-center">
                  <h1 className="text-3xl font-black text-[#ffffff] uppercase">
                    {name}
                  </h1>
                </div>
                <div className="flex flex-col gap-3 justify-center">
                  <h1 className="uppercase text-md font-black text-[#161a1d88]">
                    <span className="uppercase text-md font-black text-[#ffffffbc]">
                      Equipment
                    </span>
                  </h1>

                  <h1 className=" capitalize text-sm font-light text-[#adadad] bg-[#9e9e9e42] p-2 pl-4  rounded-full">
                    <span>{equipment}</span>
                  </h1>
                </div>
                <div className="mb-2 flex flex-col gap-3 justify-center">
                  <h1 className="uppercase text-md font-black text-[#161a1d88]">
                    <span className="uppercase text-md font-black text-[#ffffffbc]">
                      Muscle
                    </span>
                  </h1>
                  <h1 className="capitalize text-sm font-light text-[#adadad] bg-[#9e9e9e42] p-2 pl-4  rounded-full">
                    <span>{target || muscle}</span>
                  </h1>
                </div>
              </div>
            </div>
          </Fade>
        </Modal>
      ) : (
        ""
      )}
    </>
  );
}
