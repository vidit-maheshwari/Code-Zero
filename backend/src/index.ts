
// require('dotenv').config();
// const axios = require('axios');
// import Groq from "groq-sdk";

// // Initialize Groq with your API key
// const groq = new Groq({ apiKey: process.env.GROQ_API });

// export async function main() {
//   const chatCompletion = await getGroqChatCompletion();
//   // Print the completion returned by the LLM.
//   console.log(chatCompletion.choices[0]?.message?.content || "");
// }

// export async function getGroqChatCompletion() {
//   const prompt = "creat a todo list app"; // Example prompt

//   return groq.chat.completions.create({
//     messages: [
//       {
//         role: "user",
//         content: `Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra. \n\nPrompt: ${prompt}`
//       },
//       {
//         role: "system",
//         content: "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly. It is designed to help you with your tasks and answer your questions. The assistant is a language model trained by Groq."
//       }
//     ],
//     model: "gemma2-9b-it", // Replace with the specific model you are using
//   });
// }

// // Call the main function to test
// main();



require("dotenv").config();
import express from "express";
import Groq from "groq-sdk";
import { BASE_PROMPT, getSystemPrompt } from "./prompts";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { basePrompt as reactBasePrompt } from "./defaults/react";
import cors from "cors";

// Initialize Groq with your API key
const groq = new Groq({ apiKey: process.env.GROQ_API });
const app = express();
app.use(cors());
app.use(express.json());

app.post("/template", async (req:any, res:any) => {
  const prompt = req.body.prompt;

  try {
    // Call the Groq API for chat completion
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
        // {
        //   role: "system",
        //   content: getSystemPrompt(prompt),
        // },
        {
          role: "system",
          content: "You are a highly intelligent assistant. Return only a single word based on the context: either 'node' or 'react'. Do not return anything extra.",
        },
      ],
      model: "gemma2-9b-it", // Replace with your specific Groq model ID
    });

    const answer = response.choices[0]?.message?.content?.trim(); // react or node
    console.log(answer);

    if (answer === "react") {
      res.json({
        prompts: [
          BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [reactBasePrompt],
      });
      return;
    }

    if (answer === "node") {
      res.json({
        prompts: [
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [nodeBasePrompt],
      });
      return;
    }

    res.status(403).json({ message: "You can't access this" });
    // console.log(res)
  } catch (error:any) {
    console.error('Error with Groq API:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: "An error occurred with the Groq API" });
  }
});

app.post("/chat", async (req:any, res:any) => {
  const messages = req.body.messages;

  try {
    // Call the Groq API for chat completion
    const response = await groq.chat.completions.create({
      messages: messages,
      model: "gemma2-9b-it", // Replace with your specific Groq model ID
    });

    console.log(response);

    res.json({
      response: response.choices[0]?.message?.content || "",
    });
  } catch (error:any) {
    console.error('Error with Groq API:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: "An error occurred with the Groq API" });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
