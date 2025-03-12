import axios from "axios";

const API_URL = "https://libretranslate.com/translate";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function translateText(text: string, targetLang: string, retries = 3) {
  try {
    const response = await axios.post(API_URL, {
      q: text,
      source: "auto",
      target: targetLang,
      format: "text"
    });
    return response.data.translatedText;
  } catch (error: any) {
    if (error.response?.status === 400) {
      console.error("Bad request: ", error.response?.data);
      return text;
    }
    if (error.response?.status === 429 && retries > 0) {
      console.warn("Rate limit hit, retrying...");
      await delay(2000); // Wait for 2 seconds
      return translateText(text, targetLang, retries - 1); // Retry with reduced retries
    }
    console.error("Translation error:", error);
    return text; // Fallback to original text if error persists
  }
}
