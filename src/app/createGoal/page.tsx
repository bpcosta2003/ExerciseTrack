/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
"use client";
import Button from "@/components/Button";
import supabase from "@/pages/api/supabase";
import getCookie from "@/utils/getCookie";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import React, {FormEvent, useCallback, useState} from "react";
import plus from "../../../public/add.gif";
import back from "../../../public/arrowback.gif";

const goalType = ["Lose weight", "Gain weight", "Maintain weight "];

export default function createGoal() {
  const Day = new Date().getDate() + 1;
  const Month = new Date().getMonth() + 1;
  const Year = new Date().getFullYear();
  const deadlineStart = `${Year}-${Month < 10 ? "0" + Month : Month}-${Day}`;

  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [actualWeight, setActualWeight] = useState("");
  const [expectedWeight, setExpectedWeight] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCreateGoal = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setIsProcessing(true);

      const id = getCookie();

      const {data, error, status} = await supabase.from("User Goals").insert({
        goal_type: goal,
        actual_weight: actualWeight,
        expected_weight: expectedWeight,
        deadline,
        completed: false,
        user_id: id,
      });

      if (error) {
        setHasError(true);

        setErrorMsg(`Error inserting goal data. ${JSON.stringify(error)}`);

        setIsProcessing(false);
        setTimeout(() => {
          setHasError(false);
        }, 5000);
        return;
      }

      setIsSuccess(true);
      setIsProcessing(false);
      setGoal("");
      setDeadline("");
      setActualWeight("");
      setExpectedWeight("");

      setTimeout(() => {
        window.location.href = "/myGoals";
      }, 2000);
    },
    [actualWeight, deadline, expectedWeight, goal]
  );

  const handleChangeGoalType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGoal((event.target as HTMLInputElement).value);
  };
  const handleChangeDeadline = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeadline((event.target as HTMLInputElement).value);
  };
  const handleChangeActualWeight = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setActualWeight((event.target as HTMLInputElement).value);
  };
  const handleChangeExpectedWeight = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setExpectedWeight((event.target as HTMLInputElement).value);
  };

  return (
    <form
      className="transition-all relative z-10 before:block before:absolute before:w-[50%] before:rounded-t-full before:h-[50%] before:bottom-0 before:left-0 before:bg-[#E5383B] before:z-0 after:block after:absolute after:rounded-b-full after:h-[50%] after:w-[50%] after:top-0 after:right-0 after:bg-[#E5383B] after:z-0 flex flex-col justify-between items-center  text-[#161A1D] max-[600px]:flex-col h-screen"
      onSubmit={handleCreateGoal}
    >
      <div className="transition-all backdrop-blur-3xl z-50 m-10 max-[671px]:m-0 p-10 bg-[#2c2e3083] text-white w-[50%] max-[1024px]:w-[70%] max-[1024px]:overflow-scroll rounded-xl max-[600px]:rounded-none max-[600px]:w-full h-screen flex flex-col gap-10 justify-start">
        {success ? (
          <Alert className="mt-5 transition-all" severity="success">
            Goal Successfully created!
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
        <FormControl sx={{m: 3}} component="fieldset" className="m-0">
          <h1 className="text-3xl font-black mb-9">What is you goal?</h1>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={goal}
            onChange={handleChangeGoalType}
            className="flex flex-row gap-5"
          >
            {goalType.map((type) => {
              return (
                <FormControlLabel
                  control={
                    <Radio
                      color="info"
                      icon={<MonitorWeightIcon />}
                      checkedIcon={<MonitorWeightIcon />}
                      className="text-white"
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
        <div>
          <h1 className="text-3xl font-black mb-5">Deadline</h1>
          <TextField
            fullWidth
            id="deadline"
            label=""
            type="date"
            inputProps={{min: `${deadlineStart}`}}
            variant="filled"
            className="bg-[#ffffff21] rounded-lg"
            onChange={handleChangeDeadline}
            sx={{
              color: "black !important",
              ".MuiInputLabel-root": {
                borderBottom: "#161A1D !important",
              },
              ".MuiInputBase-input, .MuiOutlinedInput-input": {
                color: "#F5F3F4 !important",
              },
              ".css-l4u8b9-MuiInputBase-root-MuiInput-root:before": {
                borderBottom: "1px solid #F5F3F4 !important",
              },
            }}
          />
        </div>

        <div>
          <h1 className="text-3xl font-black mb-5">Actual Weight</h1>
          <TextField
            fullWidth
            id="actual-weight"
            label=""
            variant="filled"
            className="bg-[#ffffff21] rounded-lg"
            type="number"
            onChange={handleChangeActualWeight}
            inputProps={{min: "0", max: "500", step: "1"}}
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
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
          />
        </div>
        <div>
          <h1 className="text-3xl font-black mb-5">Expected Weight</h1>
          <TextField
            fullWidth
            id="expected-weight"
            label=""
            variant="filled"
            className="bg-[#ffffff21] rounded-lg"
            type="number"
            onChange={handleChangeExpectedWeight}
            inputProps={{min: "0", max: "500", step: "1"}}
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
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
          />
        </div>

        <div className="bottom-0 mt-auto flex flex-row justify-between items-center gap-5">
          <Link href="/myGoals" legacyBehavior>
            <div className="z-50">
              <Button text="CANCEL" type="red" icon={back} />
            </div>
          </Link>
          {goal !== "" &&
          deadline !== "" &&
          actualWeight !== "" &&
          expectedWeight !== "" &&
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
    </form>
  );
}
