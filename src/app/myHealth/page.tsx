/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
"use client";
import Button from "@/components/Button";
import supabase from "@/pages/api/supabase";
import getCookie from "@/utils/getCookie";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import Image from "next/legacy/image";
import Link from "next/link";
import React, {FormEvent, useCallback, useEffect, useState} from "react";
import plus from "../../../public/add.gif";
import back from "../../../public/arrowback.gif";
import heartbeat from "../../../public/heartbeat.gif";

const genderType = ["Male", "Female"];

export default function myHealth() {
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

  const handleHealthStatusSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setIsProcessing(true);

      const id = getCookie();

      const {data, error} = await supabase
        .from("Users Health")
        .select("*")
        .eq("id", id);

      if (data?.length !== 0) {
        const {data, error, status} = await supabase
          .from("Users Health")
          .update({id, age, height, weight, gender})
          .eq("id", id);

        if (error) {
          setHasError(true);

          setErrorMsg(`Error updating status data. ${JSON.stringify(error)}`);

          setIsProcessing(false);
          setTimeout(() => {
            setHasError(false);
          }, 5000);
          return;
        }

        setIsSuccess(true);

        setIsProcessing(false);
        setAge("");
        setHeight("");
        setWeight("");
        setGender("");

        setTimeout(() => {
          window.location.href = "/home";
        }, 2000);
      } else {
        const {data, error, status} = await supabase
          .from("Users Health")
          .insert({id, age, height, weight, gender});

        if (error) {
          setHasError(true);

          setErrorMsg(`Error inserting status data. ${JSON.stringify(error)}`);

          setIsProcessing(false);
          setTimeout(() => {
            setHasError(false);
          }, 5000);
          return;
        }

        setIsSuccess(true);
        setIsProcessing(false);

        setAge("");
        setHeight("");
        setWeight("");
        setGender("");

        setTimeout(() => {
          window.location.href = "/home";
        }, 2000);
      }
    },
    [age, height, weight, gender]
  );

  const handleChangeAge = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAge((event.target as HTMLInputElement).value);
  };
  const handleChangeHeight = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeight((event.target as HTMLInputElement).value);
  };
  const handleChangeWeight = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeight((event.target as HTMLInputElement).value);
  };
  const handleChangeGender = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender((event.target as HTMLInputElement).value);
  };

  return (
    <form
      className="transition-all relative z-10 before:block before:absolute before:w-[50%] before:rounded-t-full before:h-[50%] before:bottom-0 before:left-0 before:bg-[#E5383B] before:z-0 after:block after:absolute after:rounded-b-full after:h-[50%] after:w-[50%] after:top-0 after:right-0 after:bg-[#E5383B] after:z-0 flex flex-col justify-between items-center text-[#161A1D] max-[600px]:flex-col h-screen"
      onSubmit={(e) => handleHealthStatusSubmit(e)}
    >
      <div className="transition-all backdrop-blur-3xl z-50 m-10 p-10 bg-[#2c2e3083] text-white w-[50%] max-[1024px]:w-[70%] max-[1024px]:overflow-scroll rounded-xl max-[600px]:rounded-none max-[600px]:w-full h-screen flex flex-col gap-10 justify-start max-[671px]:m-0">
        <div className="flex flex-row items-center justify-between ">
          <h1 className="text-3xl font-black w-full">
            {success ? (
              <Alert className=" transition-all w-full" severity="success">
                Status successfully updated!
              </Alert>
            ) : (
              "Update your Health status"
            )}
            {hasError ? (
              <Alert className=" transition-all w-full" severity="error">
                {errorMsg}
              </Alert>
            ) : (
              ""
            )}
          </h1>
          <Image
            src={heartbeat}
            alt="health"
            width={90}
            height={90}
            className="max-[671px]:hidden"
          />
        </div>

        <div>
          <h1 className="text-3xl font-black mb-5 ">Age</h1>
          <TextField
            fullWidth
            id="age"
            label=""
            variant="filled"
            value={age}
            className="bg-[#ffffff21] rounded-lg"
            type="number"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">years</InputAdornment>
              ),
            }}
            onChange={handleChangeAge}
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
          />
        </div>
        <div>
          <h1 className="text-3xl font-black mb-5">Height</h1>
          <TextField
            fullWidth
            id="height"
            label=""
            value={height}
            variant="filled"
            className="bg-[#ffffff21] rounded-lg"
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">cm</InputAdornment>,
            }}
            inputProps={{min: "0", max: "300", step: "1"}}
            onChange={handleChangeHeight}
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
          <h1 className="text-3xl font-black mb-5">Weight</h1>
          <TextField
            fullWidth
            id="weight"
            label=""
            value={weight}
            variant="filled"
            className="bg-[#ffffff21] rounded-lg"
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            inputProps={{min: "0", max: "500"}}
            onChange={handleChangeWeight}
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
          <FormControl sx={{m: 3}} component="fieldset" className="m-0">
            <h1 className="text-3xl font-black mb-5">Gender</h1>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={gender}
              onChange={handleChangeGender}
              className="flex flex-row gap-5"
            >
              {genderType.map((type) => {
                return (
                  <FormControlLabel
                    control={
                      <Radio
                        color="info"
                        icon={type === "Male" ? <MaleIcon /> : <FemaleIcon />}
                        checkedIcon={
                          type === "Male" ? <MaleIcon /> : <FemaleIcon />
                        }
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
        </div>

        <div className="bottom-0 mt-auto flex flex-row justify-between items-center gap-5">
          <Link href="/home" legacyBehavior>
            <div className="z-50">
              <Button text="CANCEL" type="red" icon={back} />
            </div>
          </Link>
          {age !== "" &&
          height !== "" &&
          weight !== "" &&
          gender !== "" &&
          isProcessing === false ? (
            <Button text="SAVE" type="white" icon={plus} />
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
                <Button text="SAVE" icon={plus} type="white" />
              )}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
