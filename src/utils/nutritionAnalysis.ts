/* eslint-disable prettier/prettier */

import axios from "axios";

export default async function nutritionAnalysis(ingredients: string) {
  const options = {
    method: "GET",
    url: "https://nutrition-by-api-ninjas.p.rapidapi.com/v1/nutrition",
    params: {
      query: `${ingredients}`,
    },
    headers: {
      "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY as string,
      "X-RapidAPI-Host": process.env
        .NEXT_PUBLIC_RAPID_API_NINJA_NUTRITION_HOST as string,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}
