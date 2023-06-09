/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
"use client";
import StartRoundedIcon from "@mui/icons-material/StartRounded";
import Image from "next/legacy/image";
import React, {useState} from "react";
import caloriesImg from "../../public/calories.png";
import carbohydratesImg from "../../public/carbohydrates.png";
import fatImg from "../../public/fat.png";
import proteinImg from "../../public/protein.png";
import NutrientsInfos from "./NutrientsInfos";

interface PropsCard {
  calories: number | undefined;
  carbohydrates: number | undefined;
  protein: number | undefined;
  fat: number | undefined;
}

export default function CardCalories({
  calories,
  carbohydrates,
  protein,
  fat,
}: PropsCard) {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step + 1 > 3) {
      setStep(0);
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="shadow-lg bg-[#2c2e3083] overflow-y-hidden flex-row  w-full p-4 text-[#bbbbbb9a] text-xl gap-5 transition-all  flex justify-between items-center h-48  max-[500px]:flex-col max-[500px]:h-auto">
      <div className="flex flex-row justify-between items-center gap-5 w-full">
        {step === 0 ? (
          <NutrientsInfos
            image={caloriesImg}
            nutrientName="Cal."
            nutrientValue={Number(calories?.toFixed(1))}
            functionNextStep={() => nextStep()}
            nextNutrientImage={carbohydratesImg}
            nextNutrientName={"Carbs."}
          />
        ) : (
          ""
        )}

        {step === 1 ? (
          <NutrientsInfos
            image={carbohydratesImg}
            nutrientName="Carbs."
            nutrientValue={Number(carbohydrates?.toFixed(1))}
            functionNextStep={() => nextStep()}
            nextNutrientImage={proteinImg}
            nextNutrientName={"Prot."}
          />
        ) : (
          ""
        )}

        {step === 2 ? (
          <NutrientsInfos
            image={proteinImg}
            nutrientName="Prot."
            nutrientValue={Number(protein?.toFixed(1))}
            functionNextStep={() => nextStep()}
            nextNutrientImage={fatImg}
            nextNutrientName={"Fat."}
          />
        ) : (
          ""
        )}

        {step === 3 ? (
          <NutrientsInfos
            image={fatImg}
            nutrientName="Fat."
            nutrientValue={Number(fat?.toFixed(1))}
            functionNextStep={() => nextStep()}
            nextNutrientImage={caloriesImg}
            nextNutrientName={"Cal."}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
