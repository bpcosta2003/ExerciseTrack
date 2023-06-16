/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
"use client";
import Button from "@/components/Button";
import ExerciseCard from "@/components/ExerciseCard";
import supabase from "@/pages/api/supabase";
import getCookie from "@/utils/getCookie";
import getExerciseApi from "@/utils/getExerciseApi";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import SkipPreviousRoundedIcon from "@mui/icons-material/SkipPreviousRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Image from "next/legacy/image";
import Link from "next/link";
import React, {FormEvent, useCallback, useEffect, useState} from "react";
import plus from "../../../public/add.gif";
import back from "../../../public/arrowback.gif";
import cross from "../../../public/cross.gif";

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function createWorkouts() {
  const [workoutName, setWorkoutName] = useState("");
  const [muscleName, setMuscleName] = useState("");
  const [weekDaysCheckbox, setWeekDaysCheckbox] = useState<string[]>([]);

  const [exercises, setExercises] = useState<any[]>([]);
  const [exercisesSelected, setExercisesSelected] = useState<any[]>([]);
  const [nameExercisesSelected, setNameExercisesSelected] = useState<string[]>(
    []
  );
  const [actualExerciseSelected, setActualExercisesSelected] = useState("");
  const [bodyPart, setBodyParts] = useState<any[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<any[]>([]);
  const [filteredSelectedValue, setFilteredSelectedValue] =
    useState("abdominals");

  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formStep, setFormStep] = useState(0);

  const nextStep = () => {
    setFormStep(1);
  };
  const prevStep = () => {
    setFormStep(0);
  };

  const createWorkout = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setIsProcessing(true);

      const id = getCookie();

      const {data, error, status} = await supabase
        .from("User Workouts")
        .insert({
          workout_name: workoutName,
          workout_muscle: muscleName,
          workout_weekdays: weekDaysCheckbox,
          workout_exercises: exercisesSelected,
          user_id: id,
        });

      if (error) {
        setHasError(true);

        setErrorMsg(`Error inserting workout data. ${JSON.stringify(error)}`);

        setIsProcessing(false);
        setTimeout(() => {
          setHasError(false);
        }, 5000);
        return;
      }

      setIsSuccess(true);
      setIsProcessing(false);
      setWorkoutName("");
      setMuscleName("");
      setWeekDaysCheckbox([]);
      setExercisesSelected([]);

      setTimeout(() => {
        window.location.href = "/myWorkouts";
      }, 2000);
    },
    [exercisesSelected, muscleName, weekDaysCheckbox, workoutName]
  );

  const generateResponseMuscle = useCallback(async () => {
    const response = await getExerciseApi(
      "get_by_muscle",
      filteredSelectedValue
    );
    setExercises(response);

    setBodyParts([
      "abdominals",
      "abductors",
      "adductors",
      "biceps",
      "calves",
      "chest",
      "forearms",
      "glutes",
      "hamstrings",
      "lats",
      "lower_back",
      "middle_back",
      "neck",
      "quadriceps",
      "traps",
      "triceps",
    ]);
  }, [filteredSelectedValue]);

  const generateFilterMuscle = useCallback(async () => {
    const filteredEx = exercises.filter(
      (exercise) => exercise.target || exercise.muscle === filteredSelectedValue
    );
    setFilteredExercises(filteredEx);
  }, [exercises, filteredSelectedValue]);

  const generateResponseName = useCallback(
    async (id: string) => {
      const response = await getExerciseApi("get_by_name", "", id);
      setActualExercisesSelected(response);
      exercisesSelected.push(response[0]);
    },
    [exercisesSelected]
  );

  useEffect(() => {
    generateResponseMuscle();
  }, [generateResponseMuscle]);

  useEffect(() => {
    generateFilterMuscle();
  }, [generateFilterMuscle]);

  const removeExercise = (name: string) => {
    const filteredRemoved = exercisesSelected.filter(
      (exercise) => exercise.name !== name
    );
    const filteredRemovedFilterName = nameExercisesSelected.filter(
      (exercise) => exercise !== name
    );

    setExercisesSelected(filteredRemoved);
    setNameExercisesSelected(filteredRemovedFilterName);
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilteredSelectedValue(event.target.value as string);
  };

  const handleSelectedExercise = (event: SelectChangeEvent) => {
    const id = event.target.value as string;

    setNameExercisesSelected([...nameExercisesSelected, id]);
    generateResponseName(id);
  };

  const handleWorkoutNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setWorkoutName((event.target as HTMLInputElement).value);
  };
  const handleMuscleNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMuscleName((event.target as HTMLInputElement).value);
  };
  const handleWeekDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      console.log(event.target.checked, event.target.name);
      setWeekDaysCheckbox([...weekDaysCheckbox, event.target.name]);
    } else {
      setWeekDaysCheckbox(
        weekDaysCheckbox.filter((weekDay) => weekDay !== event.target.name)
      );
    }
  };

  return (
    <form
      className="transition-all relative z-10 before:block before:absolute before:w-[50%] before:rounded-t-full before:h-[50%] before:bottom-0 before:left-0 before:bg-[#E5383B] before:z-0 after:block after:absolute after:rounded-b-full after:h-[50%] after:w-[50%] after:top-0 after:right-0 after:bg-[#E5383B] after:z-0 flex flex-col justify-between items-center  text-[#161A1D] max-sm:flex-col h-screen"
      onSubmit={(e) => createWorkout(e)}
    >
      {formStep === 0 ? (
        <div className="transition-all backdrop-blur-3xl z-50 m-10 p-10 bg-[#2c2e3083] text-white w-[50%] max-lg:w-[70%] max-lg:overflow-scroll rounded-xl max-sm:rounded-none max-sm:w-full h-screen flex flex-col gap-10 max-sm:m-0 justify-start">
          <div>
            <h1 className="text-3xl font-black mb-5">Workout Name</h1>
            <TextField
              fullWidth
              required
              id="workout-name"
              label=""
              variant="filled"
              className="bg-[#ffffff21] rounded-lg hover:bg-[#ffffff0a]focus:bg-[#2f3335]"
              value={workoutName}
              sx={{
                ".MuiTypography-root": {
                  color: "white !important",
                },
                ".MuiInputBase-input, .MuiOutlinedInput-input": {
                  color: "#F5F3F4 !important",
                },
                ".css-l4u8b9-MuiInputBase-root-MuiInput-root:before": {
                  borderBottom: "1px solid #F5F3F4 !important",
                },
              }}
              onChange={handleWorkoutNameChange}
            />
          </div>
          <div>
            <h1 className="text-3xl font-black mb-5">Muscle to Workout</h1>
            <TextField
              fullWidth
              required
              id="workout-muscle"
              label=""
              variant="filled"
              className="bg-[#ffffff21] rounded-lg hover:bg-[#ffffff0a]focus:bg-[#2f3335]"
              value={muscleName}
              sx={{
                ".MuiTypography-root": {
                  color: "white !important",
                },
                ".MuiInputBase-input, .MuiOutlinedInput-input": {
                  color: "#F5F3F4 !important",
                },
                ".css-l4u8b9-MuiInputBase-root-MuiInput-root:before": {
                  borderBottom: "1px solid #F5F3F4 !important",
                },
              }}
              onChange={handleMuscleNameChange}
            />
          </div>

          <FormControl
            sx={{m: 0}}
            component="fieldset"
            variant="filled"
            required={true}
            className="m-0 "
          >
            <h1 className="text-3xl font-black mb-9 ">Weekdays</h1>
            <FormGroup className="flex flex-col">
              {weekDays.map((weekday) => {
                return (
                  <FormControlLabel
                    key={weekday}
                    control={
                      <Checkbox
                        sx={{color: "#ffffff21"}}
                        name={weekday}
                        color="warning"
                        icon={<EmojiEventsIcon />}
                        checkedIcon={<EmojiEventsIcon />}
                        onChange={handleWeekDaysChange}
                        className="text-[#ffffff21]"
                        checked={weekDaysCheckbox.includes(weekday)}
                      />
                    }
                    label={weekday}
                  />
                );
              })}
            </FormGroup>
          </FormControl>
          <div className="bottom-0 mt-auto flex flex-row justify-between items-center gap-5 ">
            <Link href="/home" legacyBehavior>
              <div className="z-50">
                <Button text="CANCEL" type="red" icon={back} />
              </div>
            </Link>

            {workoutName !== "" &&
            muscleName !== "" &&
            weekDaysCheckbox.length !== 0 ? (
              <div className="h-full bg-[#ffffff21] rounded-xl hover:opacity-90  transition-all w-[100%] flex justify-center items-center">
                <button
                  onClick={() => {
                    nextStep();
                  }}
                  className=" text-[#161a1d] text-xl h-full bg-[#F5F3F4] rounded-xl hover:opacity-90  transition-all w-[100%] flex justify-center items-center gap-2"
                >
                  <p className="text-[1em] max-2ssm:text-[0.6em]">NEXT</p>
                  <div>
                    <SkipNextRoundedIcon
                      fontSize="large"
                      className="max-2ssm:text-[1.5em]"
                    />
                  </div>
                </button>
              </div>
            ) : (
              <div
                style={{pointerEvents: "none", cursor: "not-allowed"}}
                className="h-full bg-[#ffffff21] rounded-xl hover:opacity-90  transition-all w-[100%] flex justify-center items-center"
              >
                <button className="text-[#bbbbbb9a] text-xl h-full bg-[#ffffff21] rounded-xl hover:opacity-90  transition-all w-[100%] flex justify-center items-center gap-2">
                  <p className="text-[1em] max-2ssm:text-[0.6em]">NEXT</p>
                  <div>
                    <SkipNextRoundedIcon
                      fontSize="large"
                      className="max-2ssm:text-[1.5em]"
                    />
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="transition-all backdrop-blur-3xl z-50 m-10 p-10 bg-[#2c2e3083] text-white w-[50%] max-lg:w-[70%] max-lg:overflow-scroll rounded-xl max-sm:rounded-none max-sm:w-full h-screen flex flex-col gap-10 max-sm:m-0 justify-start">
          {success ? (
            <Alert className="mt-5 transition-all" severity="success">
              Workout successfully created!
            </Alert>
          ) : (
            ""
          )}
          {hasError ? (
            <Alert className="mt-5 transition-all" severity="error">
              {errorMsg}
            </Alert>
          ) : (
            ""
          )}
          <h1 className="text-3xl font-black mb-[7px]">Exercises</h1>
          <FormControl fullWidth className="border-[#F5F3F4]">
            <InputLabel
              id="demo-simple-select-label"
              sx={{
                color: "white !important",
                ".MuiInputLabel-root": {
                  color: "#F5F3F4 !important",
                },
              }}
              variant="filled"
            >
              Filter Exercise by
            </InputLabel>
            <Select
              sx={{
                color: "white !important",
                ".MuiInputLabel-root": {
                  color: "#F5F3F4 !important",
                },
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "#F5F3F4 !important",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline ": {
                  borderColor: "#F5F3F4 !important",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#F5F3F4 !important",
                },
                ".MuiSvgIcon-root ": {
                  fill: "white !important",
                },
              }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Filter Exercise"
              onChange={handleFilterChange}
              variant="filled"
              className="bg-[#ffffff21] rounded-lg hover:bg-[#2f3335] focus:bg-[#2f3335]"
              defaultValue="abdominals"
            >
              {bodyPart?.map((bodyPart) => {
                return (
                  <MenuItem key={bodyPart} value={bodyPart}>
                    {bodyPart}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth className="border-[#F5F3F4]">
            <InputLabel
              id="demo-simple-select-label"
              sx={{
                color: "white !important",
                ".MuiInputLabel-root": {
                  color: "#F5F3F4 !important",
                },
              }}
              variant="filled"
            >
              Select Exercise
            </InputLabel>
            <Select
              sx={{
                color: "white !important",
                ".MuiInputLabel-root": {
                  color: "#F5F3F4 !important",
                },
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "#F5F3F4 !important",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#F5F3F4 !important",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#F5F3F4 !important",
                },
                ".MuiSvgIcon-root ": {
                  fill: "white !important",
                },
              }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Select Exercise"
              onChange={handleSelectedExercise}
              variant="filled"
              className="bg-[#ffffff21] rounded-lg hover:bg-[#2f3335] focus:bg-[#2f3335]"
              value="actualExerciseSelected"
            >
              {filteredExercises?.map((exercise) => {
                return (
                  <MenuItem
                    key={exercise.id || exercise.name}
                    value={exercise.id || exercise.name}
                    disabled={nameExercisesSelected.includes(exercise.name)}
                  >
                    {exercise.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <div className="flex flex-wrap items-center justify-start flex-row gap-6 h-[30vh] overflow-scroll overflow-x-hidden max-sm:justify-center">
            {exercisesSelected?.map((itemsSelected, index) => {
              return (
                <div key={itemsSelected?.name}>
                  <ExerciseCard
                    equipment={itemsSelected?.equipment}
                    name={itemsSelected?.name}
                    type={itemsSelected?.type}
                    muscle={itemsSelected?.muscle}
                    difficulty={itemsSelected?.difficulty}
                    instructions={itemsSelected?.instructions}
                  />

                  <button
                    type="button"
                    onClick={() => removeExercise(itemsSelected?.name)}
                    className="bottom-0 mb-3 w-full rounded-b-full p-2 bg-[#E5383B] hover:opacity-90 transition-all flex justify-center items-center"
                  >
                    <Image src={cross} alt="DELETE" width={25} height={25} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="bottom-0 mt-auto flex flex-row justify-between items-center gap-5 ">
            <div className="h-full bg-[#E5383B] rounded-xl hover:opacity-90  transition-all  w-[100%] flex justify-center items-center">
              <button
                onClick={() => {
                  prevStep();
                }}
                className="text-white text-xl h-full bg-[#E5383B] rounded-xl hover:opacity-90  transition-all w-[100%] flex justify-center items-center gap-2"
              >
                <div>
                  <SkipPreviousRoundedIcon
                    fontSize="large"
                    className="max-2ssm:text-[1.5em]"
                  />
                </div>
                <p className="text-[1em] max-2ssm:text-[0.6em]">BACK</p>
              </button>
            </div>
            {workoutName !== "" &&
            muscleName !== "" &&
            weekDaysCheckbox.length !== 0 &&
            exercisesSelected.length !== 0 &&
            isProcessing === false ? (
              <Button text="CREATE" type="white" icon={plus} />
            ) : (
              <div
                style={{pointerEvents: "none", cursor: "not-allowed"}}
                className="z-10 opacity-50 transition-all w-[100%]"
              >
                {isProcessing === true ? (
                  <div className="bg-white rounded-lg">
                    <LoadingButton
                      size="large"
                      loading={true}
                      variant="contained"
                      className="h-[68px] rounded-lg w-full"
                    ></LoadingButton>
                  </div>
                ) : (
                  <Button text="CREATE" icon={plus} type="white" />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
