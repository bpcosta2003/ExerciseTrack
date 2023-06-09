/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
"use client";
import Button from "@/components/Button";
import CardCalories from "@/components/CardCalories";
import supabase from "@/pages/api/supabase";
import getCookie from "@/utils/getCookie";
import getRecipe from "@/utils/getRecipe";
import nutritionAnalysis from "@/utils/nutritionAnalysis";
import FavoriteIcon from "@mui/icons-material/Favorite";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import SearchIcon from "@mui/icons-material/Search";
import WhatshotRoundedIcon from "@mui/icons-material/WhatshotRounded";
import {
  Alert,
  Backdrop,
  Fade,
  FormControl,
  IconButton,
  InputAdornment,
  InputBase,
  InputLabel,
  Modal,
  OutlinedInput,
  Paper,
  Skeleton,
  TextField,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React, {FormEvent, useCallback, useEffect, useState} from "react";
import apple from "../../../public/apple.gif";
import back from "../../../public/arrowback.gif";
import book from "../../../public/book.gif";
import goal from "../../../public/goal.gif";
import ingredients from "../../../public/ingredients.png";
import recipe from "../../../public/recipe.png";
import serving from "../../../public/serving.png";

export default function myGoals() {
  const [mealInfos, setMealInfos] = useState<string[]>([]);
  const [mealName, setMealName] = useState("");
  const [favoriteMealInfos, setFavoriteMealInfos] = useState<any[]>([]);
  const [favoriteMealTitleCheck, setFavoriteMealTitleCheck] = useState<any[]>(
    []
  );
  const [actualMealSelected, setActualMealSelected] = useState("");

  const [caloriesInfos, setCaloriesInfos] = useState<number>(0);
  const [carbohydratesInfos, setCarbohydratesInfos] = useState<number>(0);
  const [proteinsInfos, setProteinsInfos] = useState<number>(0);
  const [fatInfos, setFatInfos] = useState<number>(0);
  const [showCaloriesInfos, setShowCaloriesInfos] = useState(false);
  const [showIngredientsInfos, setShowIngredientsInfos] = useState(false);
  const [showServingInfos, setShowServingInfos] = useState(false);
  const [showInstructionsInfos, setShowInstructionsInfos] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingNutrients, setLoadingNutrients] = useState<boolean>(false);
  const [withoutInfo, setWithoutInfo] = useState<boolean>(true);
  const [doNotExist, setDoNotExist] = useState<boolean>(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successFavoriteDeleted, setIsSuccessFavoriteDeleted] = useState(false);

  const [favoriteStep, setFavoriteStep] = useState(0);

  const nextStep = () => {
    setFavoriteStep(1);
  };
  const prevStep = () => {
    setFavoriteStep(0);
  };

  const generateNutritionAnalysis = useCallback(
    async (ingredients: string, name: string) => {
      let caloriesSum: number = 0;
      let carbohydratesSum: number = 0;
      let proteinsSum: number = 0;
      let fatSum: number = 0;

      setLoadingNutrients(true);

      const response = await nutritionAnalysis(ingredients);

      response.map((item: any) => {
        caloriesSum += item.calories;
        carbohydratesSum += item.carbohydrates_total_g;
        proteinsSum += item.protein_g;
        fatSum += item.fat_total_g;
        return item;
      });

      setCaloriesInfos(caloriesSum);
      setCarbohydratesInfos(carbohydratesSum);
      setProteinsInfos(proteinsSum);
      setFatInfos(fatSum);

      setActualMealSelected(name);
      setShowCaloriesInfos(true);
      setLoadingNutrients(false);
    },
    []
  );

  const getLoggedUserData = useCallback(async () => {
    const id = getCookie();

    const {data, error} = await supabase
      .from("User Meals")
      .select("*")
      .eq("user_id", id);

    if (error) {
      setHasError(true);
      setErrorMsg(`Error loading data. ${error}`);
      return;
    }

    if (data?.length !== 0) {
      setIsSuccess(true);
      setFavoriteMealInfos(data);

      setFavoriteMealTitleCheck(data.map((item) => item.title));
    } else {
      setWithoutInfo(true);
    }
  }, []);

  const handleWordMealChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMealName((event.target as HTMLInputElement).value);
  };

  const handleFavoriteMeals = useCallback(
    async (meal: any) => {
      const id = getCookie();

      setFavoriteMealInfos([...favoriteMealInfos, meal]);
      setFavoriteMealTitleCheck([...favoriteMealTitleCheck, meal.title]);

      const {data, error, status} = await supabase.from("User Meals").insert({
        title: meal.title,
        ingredients: meal.ingredients,
        servings: meal.servings,
        instructions: meal.instructions,
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
      getLoggedUserData();
    },
    [favoriteMealInfos, favoriteMealTitleCheck, getLoggedUserData]
  );

  const removeFavoriteMeal = async (id: string) => {
    const {data, error} = await supabase
      .from("User Meals")
      .delete()
      .eq("id", id);

    if (error) {
      setHasError(true);

      setErrorMsg(`Error deleting favorite meals. ${JSON.stringify(error)}`);

      setIsProcessing(false);
      setTimeout(() => {
        setHasError(false);
      }, 5000);
      return;
    }

    setIsSuccess(true);
    setIsSuccessFavoriteDeleted(true);
    setTimeout(() => {
      setIsSuccessFavoriteDeleted(false);
    }, 4000);
    setIsProcessing(false);
    getLoggedUserData();
  };

  const removeFavoriteMealFilter = useCallback(
    async (id: string) => {
      const {data, error} = await supabase
        .from("User Meals")
        .select("*")
        .eq("id", id);

      const filteredRemoved = favoriteMealInfos.filter((fav) => fav.id !== id);
      const filteredRemovedFilterName = favoriteMealTitleCheck.filter(
        (favTitle) => favTitle !== data?.[0]?.title
      );

      setFavoriteMealInfos(filteredRemoved);
      setFavoriteMealTitleCheck(filteredRemovedFilterName);
    },
    [favoriteMealInfos, favoriteMealTitleCheck]
  );

  const seeFavorites = () => {
    nextStep();
  };

  const generateResponse = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);

      const response = await getRecipe(mealName);
      setMealInfos(response);

      if (response.length === 0) {
        setWithoutInfo(true);
        setDoNotExist(true);
      } else {
        setWithoutInfo(false);
      }

      setLoading(false);
    },
    [mealName]
  );

  useEffect(() => {
    getLoggedUserData();
  }, [getLoggedUserData]);

  return (
    <div className="transition-all relative z-10 before:block before:absolute before:w-[50%] before:rounded-t-full before:h-[50%] before:bottom-0 before:left-0 before:bg-[#E5383B] before:z-0 after:block after:absolute after:rounded-b-full after:h-[50%] after:w-[50%] after:top-0 after:right-0 after:bg-[#E5383B] after:z-0 flex flex-col justify-between items-center  text-[#161A1D] max-[600px]:flex-col h-screen">
      {favoriteStep === 0 ? (
        <div className="transition-all backdrop-blur-3xl z-50 m-10  bg-[#2c2e3083] text-white w-[50%] max-[1024px]:w-[80%]  max-[1024px]:overflow-scroll rounded-t-3xl rounded-xl max-[600px]:rounded-none max-[600px]:w-full h-screen flex flex-col gap-5 max-[671px]:m-0 justify-start">
          <div className="bg-[#2c2e30a9] backdrop-blur-[100px] w-full  rounded-t-3xl max-[671px]:rounded-t-none flex flex-row max-[471px]:flex-col justify-between items-center p-10 gap-10">
            <h1 className="text-5xl font-black ">Meals</h1>

            <form className="w-full" onSubmit={(e) => generateResponse(e)}>
              <div className="pl-2 flex items-center w-full bg-[#ffffff21] text-[#F5F3F4] rounded-lg transition-all hover:bg-[#ffffff0a] focus:bg-[#2f3335]">
                <InputBase
                  sx={{color: "white", flex: 1, ml: 1}}
                  placeholder="Search recipes... (Ex.: 'Salad')"
                  inputProps={{"aria-label": "search recipes"}}
                  onChange={handleWordMealChange}
                />
                <IconButton
                  type="submit"
                  disabled={loading || mealName === ""}
                  sx={{p: "10px", color: "#ffffff37"}}
                  className="disabled:text-[#ffffff1a]"
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
              </div>
            </form>
          </div>

          <div className="p-10 pt-0 flex flex-col justify-between gap-5 ">
            <div className="flex flex-row justify-start items-center gap-5 text-[#8a8a8aa3] hover:text-[#ff9298b0] font-light ">
              <button
                onClick={() => seeFavorites()}
                type="button"
                className="shadow-lg transition-all bg-[#2c2e30] hover:bg-[#ff6c732f]   p-2 pl-4 pr-4 rounded-full flex flex-row gap-2 justify-between items-center"
              >
                <FavoriteIcon className="text-[#ff9298b0]" />
                <h1 className="text-sm  ">Favorite meals</h1>
              </button>
            </div>

            {withoutInfo ? (
              <div className="shadow-lg bg-[#2c2e3083] overflow-y-hidden flex-row  w-full p-4 text-[#bbbbbb9a] text-xl gap-5 transition-all  rounded-xl  flex justify-between items-center h-36 max-[371px]:justify-around max-[371px]:flex-col max-[371px]:h-72">
                {doNotExist ? (
                  <>
                    <div className="p-4 flex justify-between opacity-60">
                      <Image src={book} alt="health" width={100} height={100} />
                    </div>
                    <h1 className="max-[371px]:text-center text-[1em] max-[471px]:text-[0.7em] mr-10 max-[500px]:text-center max-[371px]:mr-0">
                      No recipes found!
                    </h1>
                  </>
                ) : (
                  <>
                    <div className="p-4 flex justify-between opacity-60">
                      <Image
                        src={apple}
                        alt="health"
                        width={100}
                        height={100}
                      />
                    </div>
                    <h1 className="max-[371px]:text-center text-[1em] max-[471px]:text-[0.7em] mr-10 max-[500px]:text-center max-[371px]:mr-0">
                      The recipes will be shown here!
                    </h1>
                  </>
                )}
              </div>
            ) : (
              <div className="overflow-scroll overflow-x-hidden flex flex-col h-[50vh]  rounded-xl">
                {loading ? (
                  <div className=" flex flex-col gap-5 overflow-y-hidden overflow-scroll ">
                    <div className="transition-all bg-[#2c2e30d6] rounded-xl  flex justify-start items-center h-[40rem] max-[500]:h-auto ">
                      <div className=" w-full p-8 flex flex-col gap-10 ">
                        <Skeleton
                          variant="text"
                          sx={{fontSize: "1rem"}}
                          height={90}
                          className="bg-[#ffffff36] w-full"
                        />

                        <div className="flex flex-col flex-wrap gap-4 w-full">
                          <Skeleton
                            variant="text"
                            sx={{fontSize: "1rem"}}
                            height={50}
                            className="bg-[#ffffff36] w-[50%]"
                          />
                          <Skeleton
                            variant="text"
                            sx={{fontSize: "1rem"}}
                            height={50}
                            className="bg-[#ffffff36] w-[50%]"
                          />
                          <Skeleton
                            variant="text"
                            sx={{fontSize: "1rem"}}
                            height={50}
                            className="bg-[#ffffff36] w-[50%]"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="transition-all bg-[#2c2e30d6] rounded-xl  flex justify-start items-center h-[40rem] max-[500]:h-auto ">
                      <div className=" w-full p-8 flex flex-col gap-10 ">
                        <Skeleton
                          variant="text"
                          sx={{fontSize: "1rem"}}
                          height={90}
                          className="bg-[#ffffff36] w-full"
                        />

                        <div className="flex flex-col flex-wrap gap-4 w-full">
                          <Skeleton
                            variant="text"
                            sx={{fontSize: "1rem"}}
                            height={50}
                            className="bg-[#ffffff36] w-[50%]"
                          />
                          <Skeleton
                            variant="text"
                            sx={{fontSize: "1rem"}}
                            height={50}
                            className="bg-[#ffffff36] w-[50%]"
                          />
                          <Skeleton
                            variant="text"
                            sx={{fontSize: "1rem"}}
                            height={50}
                            className="bg-[#ffffff36] w-[50%]"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="transition-all bg-[#2c2e30d6] rounded-xl  flex justify-start items-center h-[40rem] max-[500]:h-auto ">
                      <div className=" w-full p-8 flex flex-col gap-10 ">
                        <Skeleton
                          variant="text"
                          sx={{fontSize: "1rem"}}
                          height={90}
                          className="bg-[#ffffff36] w-full"
                        />

                        <div className="flex flex-col flex-wrap gap-4 w-full">
                          <Skeleton
                            variant="text"
                            sx={{fontSize: "1rem"}}
                            height={50}
                            className="bg-[#ffffff36] w-[50%]"
                          />
                          <Skeleton
                            variant="text"
                            sx={{fontSize: "1rem"}}
                            height={50}
                            className="bg-[#ffffff36] w-[50%]"
                          />
                          <Skeleton
                            variant="text"
                            sx={{fontSize: "1rem"}}
                            height={50}
                            className="bg-[#ffffff36] w-[50%]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between gap-5 items-center ">
                    {mealInfos.map((item: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className="relative bg-[#2c2e3083] shadow-lg flex flex-col justify-between gap-10 p-0 w-full rounded-xl"
                        >
                          <div className="absolute right-0 top-0 p-4 flex flex-col items-center justify-center gap-3">
                            <button
                              onClick={() => {
                                handleFavoriteMeals(item);
                              }}
                              type="button"
                              disabled={favoriteMealTitleCheck.includes(
                                item.title
                              )}
                              className="shadow-lg transition-all bg-[#2c2e30] hover:bg-[#ff929839] disabled:bg-[#ff6c736c]  p-2 rounded-full flex flex-row justify-center items-center"
                            >
                              <FavoriteIcon className="text-[#ff9298b0] text-sm" />
                            </button>
                            {showCaloriesInfos === false ? (
                              <button
                                onClick={() => {
                                  generateNutritionAnalysis(
                                    item.ingredients,
                                    item.title
                                  );
                                }}
                                type="button"
                                className="shadow-lg transition-all bg-[#2c2e30] hover:bg-[#2c2e30c7]  p-2  rounded-full flex flex-row justify-center items-center"
                              >
                                <WhatshotRoundedIcon className="text-[#ffbe92af] text-sm" />
                              </button>
                            ) : (
                              <>
                                {item.title === actualMealSelected ? (
                                  <button
                                    onClick={() => setShowCaloriesInfos(false)}
                                    type="button"
                                    className="shadow-lg transition-all bg-[#ffa86e28] hover:bg-[#ffa86e1a] p-2  rounded-full flex flex-row justify-center items-center"
                                  >
                                    <WhatshotRoundedIcon className="text-[#ffbe92af] text-sm" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      generateNutritionAnalysis(
                                        item.ingredients,
                                        item.title
                                      );
                                    }}
                                    type="button"
                                    className="shadow-lg transition-all bg-[#2c2e30] hover:bg-[#2c2e30c7]  p-2  rounded-full flex flex-row justify-center items-center"
                                  >
                                    <WhatshotRoundedIcon className="text-[#ffbe92af] text-sm" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>

                          <div className="flex flex-col gap-5 justify-center pl-8 pr-8 pt-8">
                            <h1 className="text-3xl font-black text-[#ffffff] uppercase max-[600px]:text-xl max-[600px]:w-[90%]">
                              {item.title}
                            </h1>
                          </div>

                          {showCaloriesInfos &&
                          item.title === actualMealSelected ? (
                            <div>
                              <CardCalories
                                calories={caloriesInfos}
                                carbohydrates={carbohydratesInfos}
                                protein={proteinsInfos}
                                fat={fatInfos}
                              />
                            </div>
                          ) : (
                            <>
                              {loadingNutrients &&
                              item.title === actualMealSelected ? (
                                <div className="transition-all bg-[#2c2e30d6] h-[12rem] max-[500px]:h-[20rem] flex justify-center items-center">
                                  <div className=" w-full p-4 flex flex-row gap-5 max-[500px]:flex-col justify-between max-[500px]:justify-center items-center">
                                    <Skeleton
                                      variant="circular"
                                      sx={{fontSize: "1rem"}}
                                      height={80}
                                      width={80}
                                      className="bg-[#ffffff36] p-2 m-5"
                                    />
                                    <div className="w-[50%] p-2 flex flex-col justify-center items-center">
                                      <Skeleton
                                        variant="text"
                                        sx={{fontSize: "1rem"}}
                                        height={50}
                                        className="bg-[#ffffff36] w-full"
                                      />
                                      <Skeleton
                                        variant="text"
                                        sx={{fontSize: "1rem"}}
                                        height={50}
                                        className="bg-[#ffffff36] w-full"
                                      />
                                      <Skeleton
                                        variant="text"
                                        sx={{fontSize: "1rem"}}
                                        height={50}
                                        className="bg-[#ffffff36] w-full"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                            </>
                          )}

                          <div className="flex flex-col gap-8 justify-center pl-8 pr-8">
                            <h1 className="uppercase text-md font-black text-[#161a1d88] flex flex-row justify-start items-center gap-4">
                              <div>
                                <Image
                                  src={ingredients}
                                  alt="ingredients"
                                  width={20}
                                  height={20}
                                />
                              </div>
                              <span className="uppercase text-md font-black text-[#ffffffbc] mb">
                                Ingredients
                              </span>
                              {showIngredientsInfos === false ? (
                                <button
                                  onClick={() => {
                                    setShowIngredientsInfos(true);
                                    setActualMealSelected(item.title);
                                  }}
                                  type="button"
                                  className="shadow-lg transition-all  text-[#ffffff8b] hover:text-[#ffffffdf] p-0  rounded-full flex flex-row justify-center items-center"
                                >
                                  <KeyboardArrowDownRoundedIcon className="  text-md" />
                                </button>
                              ) : (
                                <>
                                  {item.title === actualMealSelected ? (
                                    <button
                                      onClick={() => {
                                        setShowIngredientsInfos(false);
                                        setActualMealSelected(item.title);
                                      }}
                                      type="button"
                                      className="shadow-lg transition-all text-[#ffffff8b] hover:text-[#ffffffdf]p-0  rounded-full flex flex-row justify-center items-center"
                                    >
                                      <KeyboardArrowUpRoundedIcon className=" text-md" />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setShowIngredientsInfos(true);
                                        setActualMealSelected(item.title);
                                      }}
                                      type="button"
                                      className="shadow-lg transition-all  text-[#ffffff8b] hover:text-[#ffffffdf] p-0  rounded-full flex flex-row justify-center items-center"
                                    >
                                      <KeyboardArrowDownRoundedIcon className=" text-md" />
                                    </button>
                                  )}
                                </>
                              )}
                            </h1>
                            {showIngredientsInfos &&
                            item.title === actualMealSelected ? (
                              <div className="flex flex-row flex-wrap gap-4">
                                {item.ingredients
                                  .split("|")
                                  .map((item: string, index: number) => {
                                    return (
                                      <h1
                                        key={index}
                                        className=" capitalize text-sm max-[500px]:text-xs  font-light text-[#adadad] bg-[#9e9e9e42] p-2 pl-4 pr-4 rounded-full"
                                      >
                                        {item}
                                      </h1>
                                    );
                                  })}
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                          <div className="flex flex-col gap-8 justify-center pl-8 pr-8">
                            <h1 className="uppercase text-md font-black text-[#161a1d88] flex flex-row justify-start items-center gap-4">
                              <div>
                                <Image
                                  src={serving}
                                  alt="serving"
                                  width={20}
                                  height={20}
                                />
                              </div>
                              <span className="uppercase text-md font-black text-[#ffffffbc]">
                                Servings
                              </span>
                              {showServingInfos === false ? (
                                <button
                                  onClick={() => {
                                    setShowServingInfos(true);
                                    setActualMealSelected(item.title);
                                  }}
                                  type="button"
                                  className="shadow-lg transition-all text-[#ffffff8b] hover:text-[#ffffffdf] p-0  rounded-full flex flex-row justify-center items-center"
                                >
                                  <KeyboardArrowDownRoundedIcon className=" text-md" />
                                </button>
                              ) : (
                                <>
                                  {item.title === actualMealSelected ? (
                                    <button
                                      onClick={() => {
                                        setShowServingInfos(false);
                                        setActualMealSelected(item.title);
                                      }}
                                      type="button"
                                      className="shadow-lg transition-all text-[#ffffff8b] hover:text-[#ffffffdf] p-0  rounded-full flex flex-row justify-center items-center"
                                    >
                                      <KeyboardArrowUpRoundedIcon className=" text-md" />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setShowServingInfos(true);
                                        setActualMealSelected(item.title);
                                      }}
                                      type="button"
                                      className="shadow-lg transition-all text-[#ffffff8b] hover:text-[#ffffffdf] p-0  rounded-full flex flex-row justify-center items-center"
                                    >
                                      <KeyboardArrowDownRoundedIcon className="text-md" />
                                    </button>
                                  )}
                                </>
                              )}
                            </h1>
                            {showServingInfos &&
                            item.title === actualMealSelected ? (
                              <h1 className="capitalize text-sm max-[500px]:text-xs font-light text-[#adadad] bg-[#9e9e9e42] p-2 pl-4 pr-4 rounded-full">
                                <span>{item.servings}</span>
                              </h1>
                            ) : (
                              ""
                            )}
                          </div>
                          <div className="mb-2 flex flex-col gap-8 justify-center pl-8 pr-8 pb-8">
                            <h1 className="uppercase text-md font-black text-[#161a1d88] flex flex-row justify-start items-center gap-4">
                              <div>
                                <Image
                                  src={recipe}
                                  alt="recipe"
                                  width={20}
                                  height={20}
                                />
                              </div>
                              <span className="uppercase text-md font-black text-[#ffffffbc]">
                                Instructions
                              </span>
                              {showInstructionsInfos === false ? (
                                <button
                                  onClick={() => {
                                    setShowInstructionsInfos(true);
                                    setActualMealSelected(item.title);
                                  }}
                                  type="button"
                                  className="shadow-lg transition-all text-[#ffffff8b] hover:text-[#ffffffdf] p-0  rounded-full flex flex-row justify-center items-center"
                                >
                                  <KeyboardArrowDownRoundedIcon className="text-md" />
                                </button>
                              ) : (
                                <>
                                  {item.title === actualMealSelected ? (
                                    <button
                                      onClick={() => {
                                        setShowInstructionsInfos(false);
                                        setActualMealSelected(item.title);
                                      }}
                                      type="button"
                                      className="shadow-lg transition-all text-[#ffffff8b] hover:text-[#ffffffdf]  p-0  rounded-full flex flex-row justify-center items-center"
                                    >
                                      <KeyboardArrowUpRoundedIcon className="  text-md" />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setShowInstructionsInfos(true);
                                        setActualMealSelected(item.title);
                                      }}
                                      type="button"
                                      className="shadow-lg transition-all text-[#ffffff8b] hover:text-[#ffffffdf]  p-0  rounded-full flex flex-row justify-center items-center"
                                    >
                                      <KeyboardArrowDownRoundedIcon className="text-md" />
                                    </button>
                                  )}
                                </>
                              )}
                            </h1>
                            {showInstructionsInfos &&
                            item.title === actualMealSelected ? (
                              <h1 className="text-sm font-light text-[#adadad] max-[500px]:text-base">
                                {item.instructions}
                              </h1>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-row gap-5 justify-between max-[688px]:flex-col w-full p-10 pt-4 mt-auto">
            <Link href="/home" className="z-10 w-full" legacyBehavior>
              <div className="z-50  w-full">
                <Button text="Back" icon={back} type="red" />
              </div>
            </Link>
          </div>
        </div>
      ) : (
        <div className="transition-all backdrop-blur-3xl z-50 m-10  bg-[#2c2e3083] text-white w-[50%] max-[1024px]:w-[80%]  max-[1024px]:overflow-scroll rounded-t-3xl rounded-xl max-[600px]:rounded-none max-[600px]:w-full h-screen flex flex-col gap-5 max-[671px]:m-0 justify-start">
          <div className="bg-[#2c2e30a9] backdrop-blur-[100px] w-full  rounded-t-3xl max-[671px]:rounded-t-none flex flex-row max-[471px]:flex-col justify-between items-start p-10 gap-10">
            <h1 className="text-5xl font-black ">Favorite meals</h1>
          </div>

          <div className="p-10 pt-0 flex flex-col gap-5 justify-between ">
            <div className="flex flex-row justify-start items-center gap-5 text-[#8a8a8aa3] hover:text-[#92b8ffaf] font-light">
              <button
                onClick={() => prevStep()}
                type="button"
                className="shadow-lg transition-all bg-[#2c2e30] hover:bg-[#6ca0ff36]  p-2 pl-5 pr-5 rounded-full flex flex-row gap-2 justify-between items-center"
              >
                <MenuBookRoundedIcon className="text-[#92b8ffaf]" />
                <h1 className="text-sm  ">Search meals</h1>
              </button>
            </div>

            {favoriteMealInfos.length === 0 ? (
              <div className="shadow-lg bg-[#2c2e3083] overflow-y-hidden flex-row  w-full p-4 text-[#bbbbbb9a] text-xl gap-5 transition-all  rounded-xl  flex justify-between items-center h-36 max-[371px]:justify-around max-[371px]:flex-col max-[371px]:h-72">
                <>
                  <div className="p-4 flex justify-between opacity-60">
                    <Image src={goal} alt="health" width={100} height={100} />
                  </div>
                  <h1 className="max-[371px]:text-center text-[1em] max-[471px]:text-[0.7em] mr-10 max-[500px]:text-center max-[371px]:mr-0">
                    You don&apos;t have favorite meals!
                  </h1>
                </>
              </div>
            ) : (
              <div className="overflow-scroll overflow-x-hidden flex flex-col h-[50vh] rounded-xl">
                {loading ? (
                  <div className=" flex flex-col gap-5 overflow-y-hidden overflow-scroll ">
                    <div className="transition-all bg-[#2c2e30d6] rounded-xl  flex justify-start items-center h-[40rem] max-[500]:h-auto ">
                      <div className=" w-full p-8 flex flex-col gap-10 ">
                        <Skeleton
                          variant="text"
                          sx={{fontSize: "1rem"}}
                          height={90}
                          className="bg-[#ffffff36] w-full"
                        />

                        <div className="flex flex-col flex-wrap gap-4 w-full">
                          <Skeleton
                            variant="text"
                            sx={{fontSize: "1rem"}}
                            height={50}
                            className="bg-[#ffffff36] w-[50%]"
                          />
                          <Skeleton
                            variant="text"
                            sx={{fontSize: "1rem"}}
                            height={50}
                            className="bg-[#ffffff36] w-[50%]"
                          />
                          <Skeleton
                            variant="text"
                            sx={{fontSize: "1rem"}}
                            height={50}
                            className="bg-[#ffffff36] w-[50%]"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="transition-all bg-[#2c2e30d6] rounded-xl  flex justify-start items-center h-[40rem] max-[500]:h-auto ">
                      <div className=" w-full p-8 flex flex-col gap-10 ">
                        <Skeleton
                          variant="text"
                          sx={{fontSize: "1rem"}}
                          height={90}
                          className="bg-[#ffffff36] w-full"
                        />

                        <div className="flex flex-col flex-wrap gap-4 w-full">
                          <Skeleton
                            variant="text"
                            sx={{fontSize: "1rem"}}
                            height={50}
                            className="bg-[#ffffff36] w-[50%]"
                          />
                          <Skeleton
                            variant="text"
                            sx={{fontSize: "1rem"}}
                            height={50}
                            className="bg-[#ffffff36] w-[50%]"
                          />
                          <Skeleton
                            variant="text"
                            sx={{fontSize: "1rem"}}
                            height={50}
                            className="bg-[#ffffff36] w-[50%]"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="transition-all bg-[#2c2e30d6] rounded-xl  flex justify-start items-center h-[40rem] max-[500]:h-auto ">
                      <div className=" w-full p-8 flex flex-col gap-10 ">
                        <Skeleton
                          variant="text"
                          sx={{fontSize: "1rem"}}
                          height={90}
                          className="bg-[#ffffff36] w-full"
                        />

                        <div className="flex flex-col flex-wrap gap-4 w-full">
                          <Skeleton
                            variant="text"
                            sx={{fontSize: "1rem"}}
                            height={50}
                            className="bg-[#ffffff36] w-[50%]"
                          />
                          <Skeleton
                            variant="text"
                            sx={{fontSize: "1rem"}}
                            height={50}
                            className="bg-[#ffffff36] w-[50%]"
                          />
                          <Skeleton
                            variant="text"
                            sx={{fontSize: "1rem"}}
                            height={50}
                            className="bg-[#ffffff36] w-[50%]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between gap-5 items-center ">
                    {favoriteMealInfos.map((item: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className="relative bg-[#2c2e3083] shadow-lg flex flex-col justify-between gap-10 p-0 w-full rounded-xl"
                        >
                          <div className="absolute right-0 top-0 p-4 flex flex-col items-center justify-center gap-3">
                            <button
                              onClick={() => {
                                removeFavoriteMeal(item.id);
                                removeFavoriteMealFilter(item.id);
                              }}
                              type="button"
                              className="shadow-lg transition-all bg-[#2c2e30] hover:bg-[#ff929839] p-2 rounded-full flex flex-row justify-center items-center"
                            >
                              <RemoveCircleIcon className="text-[#ff9298b0] text-sm" />
                            </button>
                            {showCaloriesInfos === false ? (
                              <button
                                onClick={() => {
                                  generateNutritionAnalysis(
                                    item.ingredients,
                                    item.title
                                  );
                                }}
                                type="button"
                                className="shadow-lg transition-all bg-[#2c2e30] hover:bg-[#2c2e30c7]  p-2  rounded-full flex flex-row justify-center items-center"
                              >
                                <WhatshotRoundedIcon className="text-[#ffbe92af] text-sm" />
                              </button>
                            ) : (
                              <>
                                {item.title === actualMealSelected ? (
                                  <button
                                    onClick={() => setShowCaloriesInfos(false)}
                                    type="button"
                                    className="shadow-lg transition-all bg-[#ffa86e28] hover:bg-[#ffa86e1a] p-2  rounded-full flex flex-row justify-center items-center"
                                  >
                                    <WhatshotRoundedIcon className="text-[#ffbe92af] text-sm" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      generateNutritionAnalysis(
                                        item.ingredients,
                                        item.title
                                      );
                                    }}
                                    type="button"
                                    className="shadow-lg transition-all bg-[#2c2e30] hover:bg-[#2c2e30c7]  p-2  rounded-full flex flex-row justify-center items-center"
                                  >
                                    <WhatshotRoundedIcon className="text-[#ffbe92af] text-sm" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>

                          <div className="flex flex-col gap-5 justify-center pl-8 pr-8 pt-8">
                            <h1 className="text-3xl font-black text-[#ffffff] uppercase max-[600px]:text-xl max-[600px]:w-[90%]">
                              {item.title}
                            </h1>
                          </div>

                          {showCaloriesInfos &&
                          item.title === actualMealSelected ? (
                            <div>
                              <CardCalories
                                calories={caloriesInfos}
                                carbohydrates={carbohydratesInfos}
                                protein={proteinsInfos}
                                fat={fatInfos}
                              />
                            </div>
                          ) : (
                            <>
                              {loadingNutrients &&
                              item.title === actualMealSelected ? (
                                <div className="transition-all bg-[#2c2e30d6] h-[12rem] max-[500px]:h-[20rem] flex justify-center items-center">
                                  <div className=" w-full p-4 flex flex-row gap-5 max-[500px]:flex-col justify-between max-[500px]:justify-center items-center">
                                    <Skeleton
                                      variant="circular"
                                      sx={{fontSize: "1rem"}}
                                      height={80}
                                      width={80}
                                      className="bg-[#ffffff36] p-2 m-5"
                                    />
                                    <div className="w-[50%] p-2 flex flex-col justify-center items-center">
                                      <Skeleton
                                        variant="text"
                                        sx={{fontSize: "1rem"}}
                                        height={50}
                                        className="bg-[#ffffff36] w-full"
                                      />
                                      <Skeleton
                                        variant="text"
                                        sx={{fontSize: "1rem"}}
                                        height={50}
                                        className="bg-[#ffffff36] w-full"
                                      />
                                      <Skeleton
                                        variant="text"
                                        sx={{fontSize: "1rem"}}
                                        height={50}
                                        className="bg-[#ffffff36] w-full"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                            </>
                          )}

                          <div className="flex flex-col gap-8 justify-center pl-8 pr-8">
                            <h1 className="uppercase text-md font-black text-[#161a1d88] flex flex-row justify-start items-center gap-4">
                              <div>
                                <Image
                                  src={ingredients}
                                  alt="ingredients"
                                  width={20}
                                  height={20}
                                />
                              </div>
                              <span className="uppercase text-md font-black text-[#ffffffbc] mb">
                                Ingredients
                              </span>
                              {showIngredientsInfos === false ? (
                                <button
                                  onClick={() => {
                                    setShowIngredientsInfos(true);
                                    setActualMealSelected(item.title);
                                  }}
                                  type="button"
                                  className="shadow-lg transition-all  text-[#ffffff8b] hover:text-[#ffffffdf] p-0  rounded-full flex flex-row justify-center items-center"
                                >
                                  <KeyboardArrowDownRoundedIcon className="  text-md" />
                                </button>
                              ) : (
                                <>
                                  {item.title === actualMealSelected ? (
                                    <button
                                      onClick={() => {
                                        setShowIngredientsInfos(false);
                                        setActualMealSelected(item.title);
                                      }}
                                      type="button"
                                      className="shadow-lg transition-all text-[#ffffff8b] hover:text-[#ffffffdf]p-0  rounded-full flex flex-row justify-center items-center"
                                    >
                                      <KeyboardArrowUpRoundedIcon className=" text-md" />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setShowIngredientsInfos(true);
                                        setActualMealSelected(item.title);
                                      }}
                                      type="button"
                                      className="shadow-lg transition-all  text-[#ffffff8b] hover:text-[#ffffffdf] p-0  rounded-full flex flex-row justify-center items-center"
                                    >
                                      <KeyboardArrowDownRoundedIcon className=" text-md" />
                                    </button>
                                  )}
                                </>
                              )}
                            </h1>
                            {showIngredientsInfos &&
                            item.title === actualMealSelected ? (
                              <div className="flex flex-row flex-wrap gap-4">
                                {item.ingredients
                                  .split("|")
                                  .map((item: string, index: number) => {
                                    return (
                                      <h1
                                        key={index}
                                        className=" capitalize text-sm max-[500px]:text-xs  font-light text-[#adadad] bg-[#9e9e9e42] p-2 pl-4 pr-4 rounded-full"
                                      >
                                        {item}
                                      </h1>
                                    );
                                  })}
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                          <div className="flex flex-col gap-8 justify-center pl-8 pr-8">
                            <h1 className="uppercase text-md font-black text-[#161a1d88] flex flex-row justify-start items-center gap-4">
                              <div>
                                <Image
                                  src={serving}
                                  alt="serving"
                                  width={20}
                                  height={20}
                                />
                              </div>
                              <span className="uppercase text-md font-black text-[#ffffffbc]">
                                Servings
                              </span>
                              {showServingInfos === false ? (
                                <button
                                  onClick={() => {
                                    setShowServingInfos(true);
                                    setActualMealSelected(item.title);
                                  }}
                                  type="button"
                                  className="shadow-lg transition-all text-[#ffffff8b] hover:text-[#ffffffdf] p-0  rounded-full flex flex-row justify-center items-center"
                                >
                                  <KeyboardArrowDownRoundedIcon className=" text-md" />
                                </button>
                              ) : (
                                <>
                                  {item.title === actualMealSelected ? (
                                    <button
                                      onClick={() => {
                                        setShowServingInfos(false);
                                        setActualMealSelected(item.title);
                                      }}
                                      type="button"
                                      className="shadow-lg transition-all text-[#ffffff8b] hover:text-[#ffffffdf] p-0  rounded-full flex flex-row justify-center items-center"
                                    >
                                      <KeyboardArrowUpRoundedIcon className=" text-md" />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setShowServingInfos(true);
                                        setActualMealSelected(item.title);
                                      }}
                                      type="button"
                                      className="shadow-lg transition-all text-[#ffffff8b] hover:text-[#ffffffdf] p-0  rounded-full flex flex-row justify-center items-center"
                                    >
                                      <KeyboardArrowDownRoundedIcon className="text-md" />
                                    </button>
                                  )}
                                </>
                              )}
                            </h1>
                            {showServingInfos &&
                            item.title === actualMealSelected ? (
                              <h1 className="capitalize text-sm max-[500px]:text-xs font-light text-[#adadad] bg-[#9e9e9e42] p-2 pl-4 pr-4 rounded-full">
                                <span>{item.servings}</span>
                              </h1>
                            ) : (
                              ""
                            )}
                          </div>
                          <div className="mb-2 flex flex-col gap-8 justify-center pl-8 pr-8 pb-8">
                            <h1 className="uppercase text-md font-black text-[#161a1d88] flex flex-row justify-start items-center gap-4">
                              <div>
                                <Image
                                  src={recipe}
                                  alt="recipe"
                                  width={20}
                                  height={20}
                                />
                              </div>
                              <span className="uppercase text-md font-black text-[#ffffffbc]">
                                Instructions
                              </span>
                              {showInstructionsInfos === false ? (
                                <button
                                  onClick={() => {
                                    setShowInstructionsInfos(true);
                                    setActualMealSelected(item.title);
                                  }}
                                  type="button"
                                  className="shadow-lg transition-all text-[#ffffff8b] hover:text-[#ffffffdf] p-0  rounded-full flex flex-row justify-center items-center"
                                >
                                  <KeyboardArrowDownRoundedIcon className="text-md" />
                                </button>
                              ) : (
                                <>
                                  {item.title === actualMealSelected ? (
                                    <button
                                      onClick={() => {
                                        setShowInstructionsInfos(false);
                                        setActualMealSelected(item.title);
                                      }}
                                      type="button"
                                      className="shadow-lg transition-all text-[#ffffff8b] hover:text-[#ffffffdf]  p-0  rounded-full flex flex-row justify-center items-center"
                                    >
                                      <KeyboardArrowUpRoundedIcon className="  text-md" />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setShowInstructionsInfos(true);
                                        setActualMealSelected(item.title);
                                      }}
                                      type="button"
                                      className="shadow-lg transition-all text-[#ffffff8b] hover:text-[#ffffffdf]  p-0  rounded-full flex flex-row justify-center items-center"
                                    >
                                      <KeyboardArrowDownRoundedIcon className="text-md" />
                                    </button>
                                  )}
                                </>
                              )}
                            </h1>
                            {showInstructionsInfos &&
                            item.title === actualMealSelected ? (
                              <h1 className="text-sm font-light text-[#adadad] max-[500px]:text-base">
                                {item.instructions}
                              </h1>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-row gap-5 justify-between max-[688px]:flex-col w-full p-10 pt-4 mt-auto">
            <Link href="/home" className="z-10 w-full" legacyBehavior>
              <div className="z-50  w-full">
                <Button text="Back" icon={back} type="red" />
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
