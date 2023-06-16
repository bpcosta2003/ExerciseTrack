/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
"use client";
import supabase from "@/pages/api/supabase";
import getCookie from "@/utils/getCookie";
import CheckIcon from "@mui/icons-material/Check";
import Delete from "@mui/icons-material/Delete";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ErrorIcon from "@mui/icons-material/Error";
import {Skeleton} from "@mui/material";
import Alert from "@mui/material/Alert";
import Image from "next/legacy/image";
import Link from "next/link";
import React, {useCallback, useEffect, useState} from "react";
import goal from "../../public/goal.gif";

export default function CardGoal() {
  const [goalData, setGoalData] = useState<any[]>([]);
  const [withoutData, setIsWithoutData] = useState(false);
  const [success, setIsSuccess] = useState(false);
  const [successGoal, setIsSuccessGoal] = useState(false);
  const [successGoalDeleted, setIsSuccessGoalDeleted] = useState(false);
  const [goalCheckOrUncheck, setGoalCheckOrUncheck] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const getLoggedUserData = useCallback(async () => {
    const id = getCookie();

    const {data, error} = await supabase
      .from("User Goals")
      .select("*")
      .eq("user_id", id);

    if (error) {
      setHasError(true);
      setErrorMsg(`Error loading data. ${error}`);
      return;
    }

    if (data?.length !== 0) {
      setIsSuccess(true);
      setGoalData(data);
    } else {
      setIsWithoutData(true);
    }
  }, []);

  const changeChecked = async (id: string) => {
    const {data, error} = await supabase
      .from("User Goals")
      .select("*")
      .eq("id", id);

    const completed = data?.[0]?.completed;

    if (data?.length !== 0) {
      const {data, error, status} = await supabase
        .from("User Goals")
        .update({completed: !completed})
        .eq("id", id);

      if (error) {
        setHasError(true);

        setErrorMsg(`Error completing goal. ${JSON.stringify(error)}`);

        setIsProcessing(false);
        setTimeout(() => {
          setHasError(false);
        }, 5000);
        return;
      }

      setIsSuccess(true);
      setGoalCheckOrUncheck(!completed);

      setIsSuccessGoal(true);
      setTimeout(() => {
        setIsSuccessGoal(false);
      }, 4000);

      setIsProcessing(false);
      getLoggedUserData();
    }
  };

  const deleteGoal = async (id: string) => {
    const {data, error} = await supabase
      .from("User Goals")
      .delete()
      .eq("id", id);

    if (error) {
      setHasError(true);

      setErrorMsg(`Error deleting goal. ${JSON.stringify(error)}`);

      setIsProcessing(false);
      setTimeout(() => {
        setHasError(false);
      }, 5000);
      return;
    }

    setIsSuccess(true);

    setIsSuccessGoalDeleted(true);
    setTimeout(() => {
      setIsSuccessGoalDeleted(false);
    }, 4000);

    setIsProcessing(false);
    getLoggedUserData();
  };

  useEffect(() => {
    getLoggedUserData();
    setIsLoading(false);
  }, [getLoggedUserData]);

  return (
    <div>
      {successGoalDeleted ? (
        <>
          <Alert className="mt-5 mb-5 transition-all" severity="warning">
            Goal Deleted!
          </Alert>
        </>
      ) : (
        ""
      )}
      {successGoal ? (
        <>
          {goalCheckOrUncheck ? (
            <Alert className="mt-5 mb-5 transition-all" severity="success">
              Goal Completed!
            </Alert>
          ) : (
            <Alert className="mt-5 mb-5 transition-all" severity="warning">
              Goal Incomplete!
            </Alert>
          )}
        </>
      ) : (
        ""
      )}
      {hasError ? (
        <Alert className="mt-5 mb-5 transition-all" severity="error">
          {errorMsg}
        </Alert>
      ) : (
        ""
      )}
      {isLoading ? (
        <div className="flex flex-col gap-5 overflow-y-hidden">
          <div className="transition-all bg-[#2c2e3083] rounded-xl  flex justify-between items-center h-36 max-ssm:justify-around max-2ssm:flex-col max-2ssm:h-72 ">
            <div className="w-full p-4 pr-8 flex flex-col  max-ssm:pr-4 max-ssm:pb-12 gap-3 text-xl font-black text-end text-[#2B2D42]">
              <Skeleton
                variant="text"
                sx={{fontSize: "1rem"}}
                height={40}
                className="bg-[#ffffff36] w-full"
              />
              <Skeleton
                variant="text"
                sx={{fontSize: "1rem"}}
                height={30}
                className="bg-[#ffffff36] w-[60%]"
              />
              <div className="flex flex-row gap-5  items-start ">
                <Skeleton
                  variant="text"
                  sx={{fontSize: "1rem"}}
                  height={30}
                  className="bg-[#ffffff36] w-[20%]"
                />
                <Skeleton
                  variant="text"
                  sx={{fontSize: "1rem"}}
                  height={30}
                  className="bg-[#ffffff36] w-[20%]"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="cursor-pointer transition-all rounded-xl flex flex-col w-full gap-5 justify-between items-center h-36  max-ssm:flex-col max-ssm:h-72">
          {withoutData ? (
            <div className="shadow-lg  bg-[#2c2e3083] overflow-y-hidden flex-row  w-full p-4 text-[#bbbbbb9a] text-xl gap-5 transition-all  rounded-xl  flex justify-between items-center h-36 max-ssm:justify-around max-ssm:flex-col max-ssm:h-72">
              <div className="p-4 flex justify-between opacity-60">
                <Image src={goal} alt="health" width={100} height={100} />
              </div>
              <Link
                href="/createGoal"
                className="hover:opacity-70 transition-all p-4 pr-8 flex flex-col max-ssm:flex-row max-ssm:pr-4 max-ssm:pb-12 gap-3 text-xl font-black text-end "
                legacyBehavior
              >
                <h1 className="max-ssm:text-center text-[1em] max-2ssm:text-[0.7em] mr-10 max-2ssm:text-center max-ssm:mr-0">
                  Your goals will be shown here!
                </h1>
              </Link>
            </div>
          ) : (
            <>
              {goalData.map((goal, index) => {
                return (
                  <div
                    key={index}
                    className="w-full bg-[#F5F3F4] rounded-xl  flex justify-between items-center h-28 max-2ssm:flex-col max-2ssm:h-60 max-2ssm:items-center"
                  >
                    <div className="h-full max-2ssm:h-[20%] max-2ssm:w-full">
                      {goal.completed ? (
                        <button
                          onClick={() => changeChecked(goal.id)}
                          className="transition-all p-3 bg-[#26C485] hover:bg-[#26e096] rounded-bl-xl rounded-tl-xl max-2ssm:rounded-b-[0rem] max-2ssm:rounded-t-xl h-full w-[100%] flex justify-center items-center text-xl font-bold uppercase"
                        >
                          <div>
                            <CheckIcon
                              fontSize="medium"
                              className="text-[white]"
                            />
                          </div>
                        </button>
                      ) : (
                        <button
                          onClick={() => changeChecked(goal.id)}
                          className="transition-all p-3 bg-[#2f343871] hover:bg-[#2f343842] rounded-bl-xl rounded-tl-xl max-2ssm:rounded-b-[0rem] max-2ssm:rounded-t-xl h-full w-[100%] flex justify-center items-center text-xl font-bold uppercase"
                        >
                          <div>
                            <CheckIcon fontSize="medium" color="disabled" />
                          </div>
                        </button>
                      )}
                    </div>
                    <div className="max-2ssm:relative w-full h-44 flex flex-row justify-around items-center max-2ssm:pb-12">
                      <div className="flex flex-col gap-2 max-2ssm:mt-4">
                        <h1 className="text-[#D24D4D] font-black text-3xl">
                          {goal.actual_weight}kg
                        </h1>
                        <p className="text-[#97989A] font-black text-sm">
                          {goal.created_at.split("T")[0].split("-")[1] +
                            "/" +
                            goal.created_at.split("T")[0].split("-")[2] +
                            "/" +
                            goal.created_at.split("T")[0].split("-")[0]}
                        </p>
                      </div>
                      <div className="max-2ssm:absolute max-2ssm:pb-4 bottom-0">
                        <h1 className="text-[#161A1D] font-black text-sm">
                          {goal.goal_type}
                        </h1>
                      </div>
                      <div className="flex flex-col gap-2 max-2ssm:mt-4">
                        <h1 className="text-[#26C485] font-black text-3xl">
                          {goal.expected_weight}kg
                        </h1>
                        <p className="text-[#97989A] font-black text-sm">
                          {goal.deadline.split("T")[0].split("-")[1] +
                            "/" +
                            goal.deadline.split("T")[0].split("-")[2] +
                            "/" +
                            goal.deadline.split("T")[0].split("-")[0]}
                        </p>
                      </div>
                    </div>
                    <div className="h-full max-2ssm:h-[20%] max-2ssm:w-full">
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="transition-all p-3 bg-[#E5383B] hover:bg-[#ff3235] rounded-br-xl rounded-tr-xl max-2ssm:rounded-t-[0rem] max-2ssm:rounded-b-xl h-full w-[100%] flex justify-center items-center text-xl font-bold uppercase"
                      >
                        <div>
                          <Delete fontSize="medium" className="text-white" />
                        </div>
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}
