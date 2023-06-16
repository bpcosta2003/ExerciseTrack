/* eslint-disable prettier/prettier */
"use client";
import Button from "@/components/Button";
import CardHealth from "@/components/CardHealth";
import CardOpts from "@/components/CardOpts";
import CardTreino from "@/components/CardTreino";
import Navbar from "@/components/Navbar";
import Image from "next/legacy/image";
import Link from "next/link";
import plus from "../../../public/add.gif";
import ai from "../../../public/artificialinteligence.png";
import dashboard from "../../../public/dashboard.png";
import goal from "../../../public/goal.png";
import Logo from "../../../public/Logo.png";
import meal from "../../../public/meal.png";

export default function Home() {
  return (
    <div className="transition-all z-10 before:block before:absolute before:w-[50%] before:rounded-b-full before:h-[50%] before:top-0 before:left-0 before:bg-[#E5383B] before:z-0 after:block after:absolute after:rounded-t-full after:h-[50%] after:w-[50%] after:bottom-0 after:right-0 after:bg-[#E5383B] after:z-0 flex flex-col justify-between items-center  text-white max-sm:flex-col h-screen ">
      <div className="transition-all z-50  flex flex-col justify-center w-screen h-screen p-14 max-w-7xl max-h-full m-auto gap-10 max-sm:p-0 max-sm:justify-start ">
        <div className="transition-all backdrop-blur-3xl z-50 bg-gradient-to-t from-[#2c2e303d] rounded-3xl max-sm:rounded-none max-sm:overflow-scroll ">
          <div className="max-sm:sticky max-sm:top-0 z-[100]">
            <Navbar />
          </div>
          <div className=" p-10 flex flex-col gap-10 w-full">
            <div className="w-full flex flex-row gap-10 justify-between max-sm:flex-col  max-sm:gap-7 items-center max-sm:items-stretch">
              <div className="flex flex-row justify-center items-center gap-5 max-ssm:p-5 max-ssm:pt-6">
                <Image
                  src={Logo}
                  alt="Exercise Track"
                  width={500}
                  height={100}
                />
              </div>

              <Link href="/createWorkouts" legacyBehavior>
                <div className="z-50">
                  <Button text="Create Workout" icon={plus} type="white" />
                </div>
              </Link>
            </div>

            <div className="flex flex-row justify-between gap-10 max-2md:flex-col">
              <div className="w-full overflow-scroll overflow-x-hidden ">
                <CardTreino isToday={true} isRemovable={false} />
              </div>

              <Link href="/myHealth" className="w-full z-50 " legacyBehavior>
                <div className="transition-all w-full cursor-pointer hover:opacity-90">
                  <CardHealth />
                </div>
              </Link>
            </div>

            <div className="flex flex-col gap-10 max-sm:pb-10 overflow-scroll h-fit">
              <div className="flex flex-row w-full justify-between gap-10 max-sm:flex-col">
                <Link href="/myWorkouts" className="w-full z-50" legacyBehavior>
                  <div className="w-full">
                    <CardOpts title="My Workouts" icon={dashboard} />
                  </div>
                </Link>
                <Link href="/myGoals" className="w-full z-50" legacyBehavior>
                  <div className="w-full">
                    <CardOpts title="My Goals" icon={goal} />
                  </div>
                </Link>
              </div>
              <div className="flex flex-row w-full justify-between gap-10 max-sm:flex-col">
                <Link
                  href="/mealAnalysis"
                  className="w-full z-50"
                  aria-disabled
                  legacyBehavior
                >
                  <div
                    className="w-full "
                    // style={{pointerEvents: "none", cursor: "not-allowed"}}
                  >
                    <CardOpts title="Meals" icon={meal} />
                  </div>
                </Link>
                <Link href="/aiCreation" className="w-full z-50" legacyBehavior>
                  <div className="w-full">
                    <CardOpts title="AI Creation" icon={ai} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
