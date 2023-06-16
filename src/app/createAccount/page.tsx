/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
"use client";
import Button from "@/components/Button";
import supabase from "@/pages/api/supabase";
import LoadingButton from "@mui/lab/LoadingButton";
import {InputAdornment} from "@mui/material";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField/TextField";
import Image from "next/legacy/image";
import Link from "next/link";
import React, {FormEvent, useCallback, useState} from "react";
import plus from "../../../public/add.gif";
import running from "../../../public/running.png";

export default function CreateAccount() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail((event.target as HTMLInputElement).value);
  };
  const handleChangeNickname = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname((event.target as HTMLInputElement).value);
  };
  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword((event.target as HTMLInputElement).value);
  };
  const handleChangeRepeatPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRepeatPassword((event.target as HTMLInputElement).value);
  };

  const getLoggedUserDataToCreateCookie = useCallback(async (email: string) => {
    const {data, error} = await supabase
      .from("Users")
      .select("*")
      .eq("email", email);

    if (error) {
      console.log(`Error loading data. ${error}`);
      return;
    }

    const d = new Date();
    d.setTime(d.getTime() + 1 * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = "user=" + data?.[0].id + ";" + expires + ";path=/";
    console.log("user=" + data?.[0].id + ";" + expires + ";path=/");
  }, []);

  const handleSignUp = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setIsProcessing(true);

      const {data, error, status} = await supabase
        .from("Users")
        .insert([{email, password, nickname}]);

      if (error) {
        setHasError(true);
        if (status === 409) {
          setErrorMsg("User already signed up.");
        } else {
          setErrorMsg(`Error signing up. ${JSON.stringify(error)}`);
        }
        setIsProcessing(false);
        setTimeout(() => {
          setHasError(false);
        }, 5000);
        return;
      }

      setIsSuccess(true);

      setIsProcessing(false);
      setEmail("");
      setNickname("");
      setPassword("");
      setRepeatPassword("");

      getLoggedUserDataToCreateCookie(email);

      setTimeout(() => {
        window.location.href = "/home";
      }, 2000);
    },
    [email, password, nickname, getLoggedUserDataToCreateCookie]
  );

  return (
    <form
      onSubmit={handleSignUp}
      className=" relative flex flex-col items-center justify-center w-full h-screen p-14 max-w-5xl m-auto gap-10  max-2ssm:p-0 ssm:w-full before:block before:absolute before:w-[50%] before:rounded-b-full before:h-[40%] before:top-0 before:left-0 before:bg-[#E5383B] before:z-0 after:block after:absolute after:rounded-t-full after:h-[40%] after:w-[50%] after:bottom-0 after:right-0 after:bg-[#E5383B] after:z-0"
    >
      <div className="max-sm:m-0 max-sm:h-full max-2ssm:rounded-none max-sm:w-full max-sm:justify-between  z-50 backdrop-blur-3xl bg-[#2c2e3083] p-8 w-[50%] rounded-lg flex flex-col justify-between max-md:w-full max-lg:overflow-scroll">
        <div className="flex flex-row items-center justify-between ">
          <h1 className="text-5xl font-black max-ssm:text-3xl">Sign Up</h1>
          <Image src={running} alt="health" width={100} height={100} />
        </div>
        {success ? (
          <Alert className="mt-5 transition-all" severity="success">
            Successfully signed up!
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

        <div>
          <h1 className="text-xl mt-10 mb-5 text-[#bbbbbb9a]">Email</h1>
          <TextField
            fullWidth
            id="height"
            label=""
            variant="filled"
            className="bg-[#ffffff21] rounded-lg"
            type="email"
            required
            value={email}
            inputProps={{min: "0", max: "300", step: "1"}}
            onChange={handleChangeUsername}
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
          <h1 className="text-xl mt-10 mb-5 text-[#bbbbbb9a]">Nickname</h1>
          <TextField
            fullWidth
            id="height"
            label=""
            variant="filled"
            className="bg-[#ffffff21] rounded-lg"
            type="text"
            required
            value={nickname}
            inputProps={{min: "0", max: "300", step: "1"}}
            onChange={handleChangeNickname}
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
          <h1 className="text-xl font-black mb-5 mt-5 text-[#bbbbbb9a]">
            Password
          </h1>
          <TextField
            fullWidth
            id="height"
            label=""
            variant="filled"
            className="bg-[#ffffff21] rounded-lg"
            type="password"
            required
            value={password}
            inputProps={{min: "0", max: "300", step: "1"}}
            onChange={handleChangePassword}
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
        {(password === repeatPassword &&
          password !== "" &&
          repeatPassword !== "") === true ? (
          <div>
            <h1 className="text-xl font-black mb-5 mt-5 text-[#bbbbbb9a]">
              Repeat Password
            </h1>
            <TextField
              fullWidth
              id="height"
              label=""
              variant="filled"
              className="bg-[#02ff7421] rounded-lg"
              type="password"
              required
              value={repeatPassword}
              inputProps={{min: "0", max: "300", step: "1"}}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">Match</InputAdornment>
                ),
              }}
              onChange={handleChangeRepeatPassword}
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
        ) : (
          <div>
            <h1 className="text-xl font-black mb-5 mt-5 text-[#bbbbbb9a]">
              Repeat Password
            </h1>
            <TextField
              fullWidth
              id="height"
              label=""
              variant="filled"
              className="bg-[#ff000021] rounded-lg"
              type="password"
              required
              value={repeatPassword}
              inputProps={{min: "0", max: "300", step: "1"}}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    Don&apos;t Match
                  </InputAdornment>
                ),
              }}
              onChange={handleChangeRepeatPassword}
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
        )}

        {email !== "" &&
        nickname !== "" &&
        password !== "" &&
        repeatPassword !== "" &&
        isProcessing === false &&
        (password === repeatPassword) === true ? (
          <div className="z-50  mt-16 transition-all">
            <Button text="SIGN UP" icon={plus} type="white" />
          </div>
        ) : (
          <Link
            style={{pointerEvents: "none", cursor: "not-allowed"}}
            href="/home"
            className="z-10  mt-16 opacity-50 transition-all"
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
              <div className="">
                <Button text="SIGN UP" icon={plus} type="white" />
              </div>
            )}
          </Link>
        )}
        <div>
          <h1 className="text-sm font-normal mt-5 text-[#bbbbbb9a] text-center">
            Have an account?
            <Link href="/" className=" z-10 ml-1 mt-36 text-[#E5383B]">
              Sign In
            </Link>
          </h1>
        </div>
      </div>
    </form>
  );
}
