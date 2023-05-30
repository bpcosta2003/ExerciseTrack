/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
"use client";
import Button from "@/components/Button";
import supabase from "@/pages/api/supabase";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField/TextField";
import Image from "next/legacy/image";
import Link from "next/link";
import React, {FormEvent, useCallback, useState} from "react";
import plus from "../../../public/add.gif";
import running from "../../../public/running.png";

export default function resetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail((event.target as HTMLInputElement).value);
  };
  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword((event.target as HTMLInputElement).value);
  };
  const handleChangeRepeatPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmNewPassword((event.target as HTMLInputElement).value);
  };

  const handleReset = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setIsProcessing(true);

      const {data, error, status} = await supabase
        .from("Users")
        .select("*")
        .eq("email", email);

      if (error) {
        setHasError(true);
        setErrorMsg(`Error signing up. ${JSON.stringify(error)}`);

        setIsProcessing(false);
        setTimeout(() => {
          setHasError(false);
        }, 5000);
        return;
      }

      if (data?.length === 0) {
        setHasError(true);
        setErrorMsg("User don't exist, Sign Up!");
        setIsProcessing(false);
        setTimeout(() => {
          setHasError(false);
        }, 5000);
      } else {
        if (data?.[0].password === newPassword) {
          setHasError(true);
          setErrorMsg("You can't use your old password");
          setIsProcessing(false);
          setTimeout(() => {
            setHasError(false);
          }, 5000);
        } else {
          const {data, error} = await supabase
            .from("Users")
            .update({password: newPassword})
            .eq("email", email);

          if (error) {
            setHasError(true);
            setErrorMsg(`Error updating. ${JSON.stringify(error)}`);

            setIsProcessing(false);
            setTimeout(() => {
              setHasError(false);
            }, 5000);
          } else {
            setIsSuccess(true);
            setEmail("");
            setNewPassword("");
            setConfirmNewPassword("");
            setTimeout(() => {
              window.location.href = "/";
            }, 2000);
          }
        }
      }
    },
    [email, newPassword]
  );

  return (
    <form
      onSubmit={(e) => handleReset(e)}
      className=" relative flex flex-col items-center justify-center w-full h-screen p-14 max-w-5xl m-auto gap-10  max-[471px]:p-0 [371px]:w-full before:block before:absolute before:w-[50%] before:rounded-b-full before:h-[40%] before:top-0 before:left-0 before:bg-[#E5383B] before:z-0 after:block after:absolute after:rounded-t-full after:h-[40%] after:w-[50%] after:bottom-0 after:right-0 after:bg-[#E5383B] after:z-0"
    >
      <div className="max-[671px]:m-0 max-[671px]:h-full max-[471px]:rounded-none max-[600px]:w-full max-[600px]:justify-between  z-50 backdrop-blur-3xl bg-[#2c2e3083] p-8 w-[50%] rounded-lg flex flex-col justify-between max-[771px]:w-full max-[1024px]:overflow-scroll">
        <div className="flex flex-row items-center justify-between ">
          <h1 className="text-5xl font-black max-[390px]:text-3xl">
            Reset Password
          </h1>
          <Image src={running} alt="health" width={100} height={100} />
        </div>
        {success ? (
          <Alert className="mt-5 transition-all" severity="success">
            Password Successfully updated, Sign In!
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
            inputProps={{min: "0", max: "300", step: "1"}}
            onChange={handleChangeEmail}
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
            New Password
          </h1>
          <TextField
            fullWidth
            id="height"
            label=""
            variant="filled"
            className="bg-[#ffffff21] rounded-lg"
            type="password"
            required
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

        {(newPassword === confirmNewPassword &&
          newPassword !== "" &&
          confirmNewPassword !== "") === true ? (
          <div>
            <h1 className="text-xl font-black mb-5 mt-5 text-[#bbbbbb9a]">
              Confirm Password
            </h1>
            <TextField
              fullWidth
              id="height"
              label=""
              variant="filled"
              className="bg-[#02ff7421] rounded-lg"
              type="password"
              required
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
              Confirm Password
            </h1>
            <TextField
              fullWidth
              id="height"
              label=""
              variant="filled"
              className="bg-[#ff000021] rounded-lg"
              type="password"
              required
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
        newPassword !== "" &&
        confirmNewPassword !== "" &&
        (newPassword === confirmNewPassword) === true ? (
          <div className="z-50  mt-24 transition-all">
            <Button text="RESET" icon={plus} type="white" />
          </div>
        ) : (
          <Link
            style={{pointerEvents: "none", cursor: "not-allowed"}}
            href="/"
            className="z-10  mt-24 opacity-50 transition-all"
          >
            {isProcessing === true ? (
              <div className="bg-white rounded-lg ">
                <LoadingButton
                  size="large"
                  loading={true}
                  variant="contained"
                  className="h-[68px] rounded-lg w-full"
                ></LoadingButton>
              </div>
            ) : (
              <div className="">
                <Button text="RESET" icon={plus} type="white" />
              </div>
            )}
          </Link>
        )}

        <div>
          <h1 className="text-sm font-normal mt-5 text-[#bbbbbb9a] text-center">
            Remember password?
            <Link href="/" className=" z-10 ml-1 mt-36 text-[#E5383B]">
              Sign In
            </Link>
          </h1>
        </div>
      </div>
    </form>
  );
}
