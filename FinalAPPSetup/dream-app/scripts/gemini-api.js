const { GoogleGenerativeAI } = require("@google/generative-ai");

// Make sure to include these imports:
// import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyDoQv8qPFvYJa_lWP7cy7ER-fSLbgEN2c4");
export const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// const prompt = "Write a story about a magic backpack.";

// const result = await model.generateContent(prompt);
// console.log(result.response.text());