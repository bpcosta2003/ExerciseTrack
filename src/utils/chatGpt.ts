/* eslint-disable prettier/prettier */

import axios from "axios";

export default async function chatGpt(request: string) {
  const options = {
    method: "POST",
    url: "https://chatgpt53.p.rapidapi.com/",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY as string,
      "X-RapidAPI-Host": process.env.NEXT_PUBLIC_RAPID_API_HOST as string,
    },
    data: {
      messages: [
        {
          role: "user",
          content: `${request}, and also give me an advice to continue working on my goal (mark the advice part on the text with 'Advice:').`,
        },
      ],
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.log(error);
    return error;
  }
}
