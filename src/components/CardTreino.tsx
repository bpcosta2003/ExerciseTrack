/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
"use client";
import supabase from "@/pages/api/supabase";
import getCookie from "@/utils/getCookie";
import DeleteIcon from "@mui/icons-material/Delete";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import {Skeleton} from "@mui/material";
import Alert from "@mui/material/Alert";
import Image from "next/legacy/image";
import Link from "next/link";
import React, {useCallback, useEffect, useState} from "react";
import aim from "../../public/aim.png";
import calendar from "../../public/calendar.png";
import exercises from "../../public/exercises.png";
import walk from "../../public/walk.gif";
import walk2 from "../../public/walk2.gif";

interface PropsCardTreino {
  isToday: boolean;
  isRemovable: boolean;
}

export default function CardTreino({isToday, isRemovable}: PropsCardTreino) {
  const [workoutData, setWorkoutData] = useState<any[]>([]);
  const [todayWorkoutData, setTodayWorkoutData] = useState<any[]>([]);
  const [withoutData, setIsWithoutData] = useState(false);
  const [success, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [weekDay, setWeekDay] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successWorkoutDeleted, setIsSuccessWorkoutDeleted] = useState(false);
  const today = new Date().getDay();

  const checkWeekDay: any = (dayNumber: number) => {
    if (dayNumber === 0) {
      setWeekDay("Sunday");
    } else if (dayNumber === 1) {
      setWeekDay("Monday");
    } else if (dayNumber === 2) {
      setWeekDay("Tuesday");
    } else if (dayNumber === 3) {
      setWeekDay("Wednesday");
    } else if (dayNumber === 4) {
      setWeekDay("Thursday");
    } else if (dayNumber === 5) {
      setWeekDay("Friday");
    } else if (dayNumber === 6) {
      setWeekDay("Saturday");
    }
  };

  const getLoggedUserData = useCallback(async () => {
    const id = getCookie();

    const {data, error} = await supabase
      .from("User Workouts")
      .select("*")
      .eq("user_id", id);

    if (error) {
      setHasError(true);
      setErrorMsg(`Error loading data. ${error}`);
      return;
    }

    if (data?.length !== 0) {
      setIsSuccess(true);
      setWorkoutData(data);
      setTodayWorkoutData(data);
    } else {
      setIsWithoutData(true);
    }
  }, []);

  const getTodayWorkouts = useCallback(async () => {
    const id = getCookie();
    const filteredData: any[] = [];

    const {data, error} = await supabase
      .from("User Workouts")
      .select("*")
      .eq("user_id", id);

    if (error) {
      setHasError(true);
      setErrorMsg(`Error loading data. ${error}`);
      return;
    }

    if (data?.length !== 0) {
      setIsSuccess(true);
      data.map(async (workout: any) => {
        if (await workout.workout_weekdays.includes(weekDay)) {
          filteredData.push(workout);
        }
        return filteredData;
      });

      setTodayWorkoutData(filteredData);
      setWorkoutData(filteredData);
    } else {
      setIsWithoutData(true);
    }
  }, [weekDay]);

  const deleteWorkout = async (id: string) => {
    const {data, error} = await supabase
      .from("User Workouts")
      .delete()
      .eq("id", id);

    if (error) {
      setHasError(true);

      setErrorMsg(`Error deleting workout. ${JSON.stringify(error)}`);

      setIsProcessing(false);
      setTimeout(() => {
        setHasError(false);
      }, 5000);
      return;
    }

    setIsSuccess(true);

    setIsSuccessWorkoutDeleted(true);
    setTimeout(() => {
      setIsSuccessWorkoutDeleted(false);
    }, 4000);

    setIsProcessing(false);
    getLoggedUserData();
  };

  useEffect(() => {
    checkWeekDay(today);
    if (isToday) {
      getTodayWorkouts();
    } else {
      getLoggedUserData();
    }
    setIsLoading(false);
  }, [getLoggedUserData, today, getTodayWorkouts, isToday]);

  return (
    <div>
      {successWorkoutDeleted ? (
        <>
          <Alert className="mt-5 mb-5 transition-all" severity="warning">
            Workout Deleted!
          </Alert>
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
        <div className=" flex flex-col gap-5 overflow-y-hidden overflow-scroll">
          <div className="transition-all bg-[#2c2e3083] rounded-xl  flex justify-between items-center h-36 max-ssm:justify-around max-2ssm:flex-col max-2ssm:h-64 ">
            <div className=" w-full p-4 pr-8 flex flex-col  max-ssm:pr-4 max-ssm:pb-12 gap-3 text-xl font-black text-end text-[#2B2D42]">
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
        <div className="cursor-pointer transition-all rounded-xl flex flex-col w-full gap-5 justify-between items-center h-36 max-ssm:justify-around  max-ssm:flex-col max-ssm:h-72">
          {todayWorkoutData.length === 0 || withoutData ? (
            <>
              {isToday ? (
                <div className="shadow-lg  bg-[#F5F3F4] overflow-y-hidden flex-row  w-full p-4 text-[#2B2D42] text-xl gap-5 transition-all  rounded-xl  flex justify-between items-center h-36 max-ssm:justify-around max-ssm:flex-col max-ssm:h-72">
                  <div className="p-4 flex justify-between max-ssm:w-[8rem] max-2ssm:w-[8rem]">
                    <Image src={walk} alt="health" width={150} height={150} />
                  </div>
                  <Link
                    href="/createWorkouts"
                    className="hover:opacity-70 transition-all p-4 pr-8 flex flex-col max-ssm:flex-row max-ssm:pr-4 max-ssm:pb-12 gap-3 text-xl font-black text-end "
                    legacyBehavior
                  >
                    <h1 className="max-ssm:text-center text-[1em] max-2ssm:text-[0.7em] hover:text-[#2b2d42a6] transition-all">
                      No workouts today! Create your workouts
                    </h1>
                  </Link>
                </div>
              ) : (
                <div className=" shadow-lg  bg-[#2c2e3083] overflow-y-hidden flex-row  w-full p-4 text-[#bbbbbb9a] text-xl gap-5 transition-all  rounded-xl  flex justify-between items-center h-36 max-ssm:justify-around max-ssm:flex-col max-ssm:h-72">
                  <div className="p-4 flex justify-between opacity-60">
                    <Image src={walk2} alt="health" width={150} height={150} />
                  </div>
                  <Link
                    href="/createWorkouts"
                    className="hover:opacity-70 transition-all p-4 pr-8 flex flex-col max-ssm:flex-row max-ssm:pr-4 max-ssm:pb-12 gap-3 text-xl font-black text-end "
                    legacyBehavior
                  >
                    <h1 className="max-ssm:text-center text-[1em] max-2ssm:text-[0.7em] mr-10 max-2ssm:text-center max-ssm:mr-0">
                      Your workouts will be shown here!
                    </h1>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <>
              {workoutData.map((exercise: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="w-full shadow-lg hover:opacity-90 transition-all z-10 bg-[#F5F3F4] rounded-xl flex justify-between items-center h-36 max-2ssm:flex-col max-2ssm:h-64 max-2ssm:items-start"
                  >
                    <Link
                      href={{
                        pathname: "/workoutDescription",
                        query: {workout: exercise.id},
                      }}
                      className="w-full "
                      legacyBehavior
                    >
                      <div className="w-full p-4 pl-8 max-2ssm:pl-4 flex flex-col justify-between gap-3 text-[#2B2D42] ">
                        <h1 className="text-2xl font-black max-2ssm:text-3xl">
                          {exercise.workout_name}
                        </h1>
                        <div className="flex flex-row gap-3 items-center justify-start">
                          <Image src={aim} alt="aim" width={20} height={20} />
                          <p className="text-lg font-bold uppercase text-[#161A1D]">
                            {exercise.workout_muscle}
                          </p>
                        </div>
                        <div className="flex flex-row flex-wrap gap-7 items-center justify-start max-2ssm:flex-col max-2ssm:gap-3 max-2ssm:items-start">
                          <div className="flex flex-row gap-3 items-center justify-start">
                            <Image
                              src={exercises}
                              alt="aim"
                              width={20}
                              height={20}
                            />
                            <p className="text-sm font-bold uppercase text-[#161a1d94]">
                              {exercise.workout_exercises.length} Exercises
                            </p>
                          </div>
                          {isToday ? (
                            ""
                          ) : (
                            <div className="flex flex-row  gap-3 items-center justify-start flex-wrap">
                              <Image
                                src={calendar}
                                alt="aim"
                                width={20}
                                height={20}
                              />
                              {exercise.workout_weekdays.map(
                                (weekday: string) => {
                                  const daysOrder = {
                                    Sunday: 0,
                                    Monday: 1,
                                    Tuesday: 2,
                                    Wednesday: 3,
                                    Thursday: 4,
                                    Friday: 5,
                                    Saturday: 6,
                                  };

                                  exercise.workout_weekdays.sort(
                                    (a: string, b: string) => {
                                      return (
                                        daysOrder[a as keyof typeof daysOrder] -
                                        daysOrder[b as keyof typeof daysOrder]
                                      );
                                    }
                                  );

                                  return (
                                    <p
                                      key={weekday}
                                      className="flex items-center justify-center text-[0.5em] font-bold uppercase text-[#161a1d94] bg-[#c5c5c559] h-6 w-6 rounded-full p-1"
                                    >
                                      {[
                                        weekday[0].toUpperCase() +
                                          weekday[1].toUpperCase(),
                                      ]}
                                    </p>
                                  );
                                }
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>

                    {exercise.workout_weekdays.includes(weekDay) && isToday ? (
                      <div className="p-4 bg-[#E5383B] rounded-br-xl rounded-tr-xl h-full flex items-center max-2ssm:p-2 max-2ssm:rounded-b-xl max-2ssm:rounded-tr-[0] max-2ssm:w-full max-2ssm:h-[30%]">
                        <h1 className="[writing-mode:vertical-rl] font-black text-2xl max-2ssm:[writing-mode:horizontal-tb] max-2ssm:w-full max-2ssm:text-center">
                          TODAY
                        </h1>
                      </div>
                    ) : (
                      ""
                    )}

                    {isRemovable ? (
                      <div className="h-full z-30 max-2ssm:w-full ">
                        <button
                          onClick={() => {
                            deleteWorkout(exercise.id);
                          }}
                          className="transition-all p-7 bg-[#E5383B] hover:bg-[#ff3235] rounded-br-xl rounded-tr-xl h-full w-[100%] flex justify-center items-center text-xl font-bold uppercase max-2ssm:rounded-b-xl max-2ssm:rounded-tr-[0]"
                        >
                          <div>
                            <DeleteIcon fontSize="medium" />
                          </div>
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
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
