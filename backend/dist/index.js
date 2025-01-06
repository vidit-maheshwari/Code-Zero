"use strict";
// require('dotenv').config();
// const axios = require('axios');
// import Groq from "groq-sdk";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const express_1 = __importDefault(require("express"));
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const prompts_1 = require("./prompts");
const node_1 = require("./defaults/node");
const react_1 = require("./defaults/react");
const cors_1 = __importDefault(require("cors"));
// Initialize Groq with your API key
const groq = new groq_sdk_1.default({ apiKey: process.env.GROQ_API });
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const prompt = req.body.prompt;
    try {
        // Call the Groq API for chat completion
        const response = yield groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
                {
                    role: "system",
                    content: "You are a highly intelligent assistant. Return only a single word based on the context: either 'node' or 'react'. Do not return anything extra.",
                },
            ],
            model: "gemma2-9b-it", // Replace with your specific Groq model ID
        });
        const answer = (_c = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim(); // react or node
        console.log(answer);
        if (answer === "react") {
            res.json({
                prompts: [
                    prompts_1.BASE_PROMPT,
                    `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
                ],
                uiPrompts: [react_1.basePrompt],
            });
            return;
        }
        if (answer === "node") {
            res.json({
                prompts: [
                    `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
                ],
                uiPrompts: [node_1.basePrompt],
            });
            return;
        }
        res.status(403).json({ message: "You can't access this" });
        // console.log(res)
    }
    catch (error) {
        console.error('Error with Groq API:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: "An error occurred with the Groq API" });
    }
}));
app.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const messages = req.body.messages;
    try {
        const response = yield groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: yield (0, prompts_1.getSystemPrompt)()
                },
                ...messages
            ],
            model: "gemma2-9b-it",
        });
        console.log(response);
        res.json({
            response: (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content
        });
    }
    catch (error) {
        console.error('Error with Groq API:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: "An error occurred with the Groq API" });
    }
}));
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
