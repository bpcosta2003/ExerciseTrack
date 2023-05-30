/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
"use client";
import Button from "@/components/Button";
import supabase from "@/pages/api/supabase";
import chatGpt from "@/utils/chatGpt";
import getCookie from "@/utils/getCookie";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import NoFoodIcon from "@mui/icons-material/NoFood";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import SkipPreviousRoundedIcon from "@mui/icons-material/SkipPreviousRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import {Grid} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import React, {useCallback, useEffect, useState} from "react";
import plus from "../../../public/add.gif";
import back from "../../../public/arrowback.gif";

const cutbulk = ["Cutting", "Bulking"];
const genderType = ["Male", "Female"];
const workoutsPWeek = [0, 1, 2, 3, 4, 5, 6, 7];

export default function aiCreation() {
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [typeCutBulk, setTypeCutBulk] = useState("");
  const [totalDays, setTotalDays] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<any>("");
  const [adviceMessage, setAdviceMessage] = useState<string>("");

  const [formStep, setFormStep] = useState(0);

  const nextStep = () => {
    setFormStep(1);
  };
  const prevStep = () => {
    setFormStep(0);
  };

  const getLoggedUserData = useCallback(async () => {
    const id = getCookie();

    const {data, error} = await supabase
      .from("Users Health")
      .select("*")
      .eq("id", id);

    if (error) {
      console.log(`Error loading data. ${error}`);
      return;
    }

    if (data?.length !== 0) {
      setAge(data?.[0]?.age);
      setHeight(data?.[0]?.height);
      setWeight(data?.[0]?.weight);
      setGender(data?.[0]?.gender);
    } else {
      setAge("");
      setHeight("");
      setWeight("");
      setGender("");
    }
  }, []);

  useEffect(() => {
    getLoggedUserData();
  }, [getLoggedUserData]);

  const generateResponse = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const request = `Calculate my basal metabolic rate (BMR) using the Harris-Benedict equation revised by Mifflin and St Jeor in 1990. I have ${age} years, ${weight} of weight, ${height} cm height, sex ${gender}, do activities ${totalDays} times a week. Multiply my BMR by the physical activity factor (FA) which is 1,55 and give the result not the formula. ${
      typeCutBulk === "Bulking"
        ? "Add 400 calories to this value to be my total calorie spending on the day."
        : "Reduce from this value 400 calories to be my total calorie spending on the day."
    } For the calculation of macronutrients use 2x protein by body weight and 1x fat by body weight, the rest of calories are carbohydrates. Show me just the description and result, do not show me the math.`;

    const response = await chatGpt(request);
    setResponseMessage(response.split("Advice:")[0]);
    setAdviceMessage(response.split("Advice:")[1]);

    setLoading(false);
    nextStep();
  };

  const handleCutBulkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypeCutBulk((event.target as HTMLInputElement).value);
  };

  const handleTotalDaysChange = (event: SelectChangeEvent) => {
    setTotalDays(event.target.value as string);
  };

  const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAge((event.target as HTMLInputElement).value);
  };
  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeight((event.target as HTMLInputElement).value);
  };
  const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeight((event.target as HTMLInputElement).value);
  };
  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender((event.target as HTMLInputElement).value);
  };

  return (
    <>
      {formStep === 0 ? (
        <form
          className="transition-all relative z-10 before:block before:absolute before:w-[50%] before:rounded-t-full before:h-[50%] before:bottom-0 before:left-0 before:bg-[#E5383B] before:z-0 after:block after:absolute after:rounded-b-full after:h-[50%] after:w-[50%] after:top-0 after:right-0 after:bg-[#E5383B] after:z-0 flex flex-col justify-between items-center  text-[#161A1D] max-[600px]:flex-col h-screen"
          onSubmit={(e) => generateResponse(e)}
        >
          <div className="transition-all backdrop-blur-3xl z-50 m-10 max-[671px]:m-0 p-10 bg-[#2c2e3083] text-white w-[50%] max-[1024px]:w-[70%] max-[1024px]:overflow-scroll rounded-xl max-[600px]:rounded-none max-[600px]:w-full h-screen flex flex-col gap-10 justify-start">
            <Grid container rowSpacing={6} columnSpacing={6}>
              <Grid item xs={12} xl={6} sm={6} md={6} lg={6}>
                <div>
                  <h1 className="text-3xl font-black mb-5">Age</h1>
                  <TextField
                    required
                    fullWidth
                    id="age"
                    label=""
                    variant="filled"
                    className="bg-[#ffffff21] rounded-lg"
                    type="number"
                    value={age}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">years</InputAdornment>
                      ),
                    }}
                    inputProps={{min: "0", max: "120", step: "1"}}
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
                    onChange={handleAgeChange}
                  />
                </div>
              </Grid>
              <Grid item xs={12} xl={6} sm={6} md={6} lg={6}>
                <div>
                  <h1 className="text-3xl font-black mb-5">Height</h1>
                  <TextField
                    required
                    fullWidth
                    id="height"
                    label=""
                    variant="filled"
                    className="bg-[#ffffff21] rounded-lg"
                    type="number"
                    value={height}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">cm</InputAdornment>
                      ),
                    }}
                    inputProps={{min: "0", max: "300", step: "1"}}
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
                    onChange={handleHeightChange}
                  />
                </div>
              </Grid>
              <Grid item xs={12} xl={12} sm={12} md={12} lg={12}>
                <div>
                  <h1 className="text-3xl font-black mb-5">Weight</h1>
                  <TextField
                    required
                    fullWidth
                    id="weight"
                    label=""
                    variant="filled"
                    className="bg-[#ffffff21] rounded-lg"
                    type="number"
                    value={weight}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">kg</InputAdornment>
                      ),
                    }}
                    inputProps={{min: "0", max: "500", step: "1"}}
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
                    onChange={handleWeightChange}
                  />
                </div>
              </Grid>

              <Grid item xs={12} xl={6} sm={6} md={6} lg={6}>
                <FormControl
                  sx={{m: 0, color: "white"}}
                  component="fieldset"
                  className="m-0"
                >
                  <h1 className="text-3xl font-black mb-5">Gender</h1>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={gender}
                    onChange={handleGenderChange}
                    className="flex flex-row gap-5"
                  >
                    {genderType.map((type) => {
                      return (
                        <FormControlLabel
                          control={
                            <Radio
                              color="info"
                              icon={
                                type === "Male" ? <MaleIcon /> : <FemaleIcon />
                              }
                              checkedIcon={
                                type === "Male" ? <MaleIcon /> : <FemaleIcon />
                              }
                              className="text-white"
                              sx={{color: "#ffffff21"}}
                            />
                          }
                          key={type}
                          value={type}
                          label={type}
                        />
                      );
                    })}
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} xl={6} sm={6} md={6} lg={6}>
                <FormControl
                  sx={{m: 0, color: "white"}}
                  component="fieldset"
                  variant="standard"
                  className="m-0 "
                  required
                >
                  <h1 className="text-3xl font-black mb-5">Routine</h1>
                  <RadioGroup
                    sx={{flexDirection: "row", color: "white"}}
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    className="flex flex-row"
                    value={typeCutBulk}
                    onChange={handleCutBulkChange}
                  >
                    {cutbulk.map((type) => {
                      return (
                        <FormControlLabel
                          control={
                            <Radio
                              icon={
                                type === "Cutting" ? (
                                  <FastfoodIcon />
                                ) : (
                                  <NoFoodIcon />
                                )
                              }
                              checkedIcon={
                                type === "Cutting" ? (
                                  <FastfoodIcon />
                                ) : (
                                  <NoFoodIcon />
                                )
                              }
                              className="text-white"
                              sx={{color: "#ffffff21"}}
                            />
                          }
                          key={type}
                          value={type}
                          label={type}
                        />
                      );
                    })}
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>

            <h1 className="text-3xl font-black mb-[7px]">Workouts per week</h1>
            <FormControl fullWidth className="border-[#F5F3F4]" required>
              <Select
                sx={{
                  color: "white !important",
                  ".MuiInputLabel-root": {
                    color: "#F5F3F4 !important",
                  },
                  ".MuiSvgIcon-root ": {
                    fill: "white !important",
                  },
                }}
                labelId="demo-simple-select-label"
                variant="filled"
                className="bg-[#ffffff21] rounded-lg hover:bg-[#2f3335] focus:bg-[#2f3335]"
                id="demo-simple-select"
                label=""
                onChange={handleTotalDaysChange}
                defaultValue="0"
              >
                {workoutsPWeek.map((days) => {
                  return (
                    <MenuItem key={days} value={days}>
                      {days}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <div className="bottom-0 mt-auto flex flex-row justify-between items-center gap-5 ">
              <Link href="/home" legacyBehavior>
                <div className="z-50 w-full">
                  <Button text="CANCEL" type="red" icon={back} />
                </div>
              </Link>
              {age !== "" &&
              height !== "" &&
              weight !== "" &&
              gender !== "" &&
              typeCutBulk !== "" &&
              loading === false ? (
                <Button text="GENERATE" type="white" icon={plus} />
              ) : (
                <div
                  style={{pointerEvents: "none", cursor: "not-allowed"}}
                  className="z-10 opacity-50 transition-all w-[100%]"
                >
                  {loading === true ? (
                    <div className="bg-white rounded-lg">
                      <LoadingButton
                        size="large"
                        loading={true}
                        variant="contained"
                        className="h-[68px] rounded-lg w-full"
                      ></LoadingButton>
                    </div>
                  ) : (
                    <Button text="GENERATE" icon={plus} type="white" />
                  )}
                </div>
              )}
            </div>
          </div>
        </form>
      ) : (
        <div className="transition-all relative z-10 before:block before:absolute before:w-[50%] before:rounded-t-full before:h-[50%] before:bottom-0 before:left-0 before:bg-[#E5383B] before:z-0 after:block after:absolute after:rounded-b-full after:h-[50%] after:w-[50%] after:top-0 after:right-0 after:bg-[#E5383B] after:z-0 flex flex-col justify-between items-center  text-[#161A1D] max-[600px]:flex-col h-screen">
          <div className="transition-all backdrop-blur-3xl z-50 m-10 max-[671px]:m-0 p-10 bg-[#2c2e3083] text-white w-[50%] max-[1024px]:w-[70%] max-[1024px]:overflow-scroll rounded-xl max-[600px]:rounded-none max-[600px]:w-full h-screen flex flex-col gap-10 justify-between">
            <div className="overflow-scroll rounded-xl flex flex-col gap-10 justify-between ">
              <p className="flex flex-wrap gap-5 text-left text-2xl max-[671px]:text-xl">
                {responseMessage}
              </p>
              <p className="flex flex-wrap gap-5 text-left text-2xl max-[671px]:text-xl">
                {adviceMessage}
              </p>

              <p className="flex flex-wrap gap-5 text-left text-2xl max-[671px]:text-xl">
                Always search for a real professional, this is just an
                estimative.
              </p>
            </div>

            <div className="bottom-0 mt-auto flex flex-row justify-between items-center gap-5 ">
              <div className="h-[68px]  bg-[#E5383B] rounded-xl hover:opacity-90  transition-all  w-[100%] flex justify-center items-center">
                <button
                  onClick={() => {
                    prevStep();
                  }}
                  className="text-white text-xl h-[68px] bg-[#E5383B] rounded-xl hover:opacity-90  transition-all w-[100%] flex justify-center items-center gap-2"
                >
                  <div>
                    <SkipPreviousRoundedIcon fontSize="large" />
                  </div>
                  DO IT AGAIN!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
