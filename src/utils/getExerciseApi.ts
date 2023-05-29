/* eslint-disable prettier/prettier */

import axios from "axios";

export default async function getExerciseApi(
  type: string,
  muscle?: string,
  name?: string
) {
  if (type === "get_by_muscle") {
    const options = {
      method: "GET",
      url: "https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises",
      params: {muscle: `${muscle}`},
      headers: {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY as string,
        "X-RapidAPI-Host": process.env
          .NEXT_PUBLIC_RAPID_API_NINJA_HOST as string,
      },
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      return error;
    }
  } else if (type === "get_by_name") {
    const options = {
      method: "GET",
      url: "https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises",
      params: {
        name: `${name}`,
      },
      headers: {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY as string,
        "X-RapidAPI-Host": process.env
          .NEXT_PUBLIC_RAPID_API_NINJA_HOST as string,
      },
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
