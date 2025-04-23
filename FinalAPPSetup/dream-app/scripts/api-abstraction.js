import { model } from "./gemini-api";
import { generateAnimationLink } from './gooey-api'; 
import { supabase } from "../supabase/supabase";

export const textModel = async (prompt) => {
  const textModel = model;

  try {
    const result = await textModel.generateContent(prompt);
    return await result.response.text(); 
  } catch (error) {
    console.error('Error generating Gemini content:', error);
    throw error;
  }
};

export function generateVideo(dreamInput) {
  try {
    return generateAnimationLink(dreamInput);
  } catch (error) {
    console.error('Error generating Gooey animation:', error);
    throw error;
  }
};

export async function insertDream({
  username,
  time,
  date,
  input,
  output,
  theme = null,
  rating = null,
}) {
  try {
    const { data, error } = await supabase.from("Dream").insert([
      {
        username,
        time,
        date,
        input,
        output,
        theme,
        rating,
      },
    ]);

    if (error) {
      console.error("Error inserting into Dream table:", error);
      return { success: false, error };
    }

    console.log("Dream log successfully inserted:", data);
    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error during Dream log insertion:", err);
    return { success: false, error: err };
  }
}
