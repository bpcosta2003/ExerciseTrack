/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
"use client";
import supabase from "@/pages/api/supabase";
import getCookie from "@/utils/getCookie";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import {Skeleton} from "@mui/material";
import MuiAlert, {AlertProps} from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Snackbar from "@mui/material/Snackbar";
import React, {useCallback, useEffect, useState} from "react";

const CDNURL =
  "https://dskehelyakelwuozfzay.supabase.co/storage/v1/object/public/images/";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Navbar() {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const [profileImageURLCDN, setProfileImageURLCDN] = useState("");
  const [loggedUserName, setLoggedUserName] = useState("");
  const [loggedUserId, setLoggedUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [success, setIsSuccess] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const getLoggedUserData = useCallback(async () => {
    const id = getCookie();
    const {data, error} = await supabase.from("Users").select("*").eq("id", id);

    if (error) {
      console.log(`Error loading data. ${error}`);
      return;
    }

    setLoggedUserName(await data?.[0]?.nickname);
    setLoggedUserId(await data?.[0]?.id);
  }, []);

  const getProfileImage = useCallback(async () => {
    const {data, error} = await supabase.storage
      .from("images")
      .list(loggedUserName + "-" + loggedUserId + "/", {
        sortBy: {column: "created_at", order: "desc"},
      });

    if (error) {
      setHasError(true);
      handleClick();
      setErrorMsg(`Error getting profile image. ${error}`);
      setTimeout(() => {
        setHasError(false);
      }, 2000);
    }

    setProfileImageURLCDN(
      CDNURL + loggedUserName + "-" + loggedUserId + "/" + data?.[0]?.name
    );

    return data;
  }, [loggedUserName, loggedUserId]);

  useEffect(() => {
    getLoggedUserData();
    getProfileImage();
    setIsLoading(false);
  }, [getLoggedUserData, getProfileImage]);

  const addImage = async (file: any) => {
    const {data, error} = await supabase.storage
      .from("images")
      .upload(
        loggedUserName + "-" + loggedUserId + "/" + file?.name,
        file as File
      );

    if (error) {
      setHasError(true);
      handleClick();
      setErrorMsg(`Error updating  profile image. ${error}`);
      setTimeout(() => {
        setHasError(false);
      }, 2000);
    }
    setIsSuccess(true);
    handleClick();
    setMessageSuccess("Profile Image updated successfully!");
    setTimeout(() => {
      setIsSuccess(false);
    }, 2000);
  };

  const handleSetProfileImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let file;

    const actualImage = await getProfileImage();

    if (event.target.files && event.target.files[0]) {
      file = event.target.files[0];

      if (actualImage?.length === 0) {
        setProfileImageURLCDN(
          CDNURL + loggedUserName + "-" + loggedUserId + "/" + file?.name
        );

        addImage(file);
      } else {
        const {data, error} = await supabase.storage
          .from("images")
          .remove([
            `${loggedUserName}-${loggedUserId}/${actualImage?.[0]?.name}`,
          ]);

        setProfileImageURLCDN(
          CDNURL + loggedUserName + "-" + loggedUserId + "/" + file?.name
        );

        addImage(file);
      }
    }
  };

  const handleRemoveProfileImage = async () => {
    const image = await getProfileImage();

    if (image?.length === 0) {
      setHasError(true);
      handleClick();
      setErrorMsg(`Error, no image to delete. Add image first!`);
      setTimeout(() => {
        setHasError(false);
      }, 2000);
    } else {
      setIsDelete(true);
      handleClick();
      setMessageSuccess("Profile Image deleted successfully!");
      setTimeout(() => {
        setIsDelete(false);
      }, 2000);
      const {data, error} = await supabase.storage
        .from("images")
        .remove([`${loggedUserName}-${loggedUserId}/${image?.[0]?.name}`]);

      setProfileImageURLCDN(`${loggedUserName}`);
    }
  };

  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <>
      {success || isDelete ? (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{width: "100%"}}>
            {messageSuccess}
          </Alert>
        </Snackbar>
      ) : (
        ""
      )}
      {hasError ? (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{width: "100%"}}>
            {errorMsg}
          </Alert>
        </Snackbar>
      ) : (
        ""
      )}

      <div className="shadow-lg transition-all w-full">
        <div className="transition-all rounded-t-3xl max-sm:rounded-t-none flex flex-row justify-between gap-10">
          <div className="bg-[#2c2e30a9] backdrop-blur-[100px] w-full rounded-t-3xl max-sm:rounded-t-none flex flex-row justify-between items-center ">
            {isLoading ? (
              <div className="flex flex-row justify-center items-center gap-5 p-4 w-full">
                <Skeleton variant="circular" className="bg-[#ffffff36]">
                  <Avatar />
                </Skeleton>
                <Skeleton
                  variant="text"
                  sx={{fontSize: "1rem"}}
                  height={50}
                  className="bg-[#ffffff36] w-full"
                />
              </div>
            ) : (
              <div className=" flex flex-row justify-center items-center gap-5 p-4">
                <div className="relative">
                  <button
                    onClick={handleRemoveProfileImage}
                    className="absolute flex items-center backdrop-blur-[100px] rounded-full top-0 left-0 m-[1.5rem] z-50 hover:text-[#e5383bd8] hover:bg-[#ff3f422f] transition-all"
                  >
                    <HighlightOffTwoToneIcon />
                  </button>

                  <label htmlFor="image">
                    <input
                      type="file"
                      id="image"
                      name="image"
                      style={{display: "none"}}
                      accept=".jpg, .jpeg, .png"
                      onChange={handleSetProfileImage}
                    />

                    <Avatar
                      alt={loggedUserName}
                      src={profileImageURLCDN}
                      className=" cursor-pointer hover:opacity-70 transition-all"
                    ></Avatar>
                  </label>
                </div>

                <h1 className="text-lg font-medium flex flex-row items-center justify-between">
                  Hello {loggedUserName}!{" "}
                </h1>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="bg-[#63646479] h-full w-16 rounded-tr-3xl max-sm:rounded-tr-none hover:bg-[#e5383b29] transition-all"
            >
              <LogoutRoundedIcon />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
