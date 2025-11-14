
import { GoogleGenAI } from "@google/genai";
import type { GroundingChunk, Source } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchPatentInfo(query: string): Promise<{ text: string; sources: Source[] }> {
    const model = 'gemini-2.5-flash';
    
    const prompt = `You are an expert patent researcher and engineering mentor. Your goal is to provide educational, self-teaching guidance. Based on the user's query about "${query}", conduct a deep dive using your search tools to find relevant patents. Explain the core principles and technology behind them in a clear, accessible way. Finally, outline a step-by-step guide on how someone could create a basic prototype based on the publicly available information from these patents. Format your response in clear, well-structured Markdown.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text;
        const groundingChunks: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        const sources: Source[] = groundingChunks
            .map(chunk => chunk.web)
            .filter((web): web is { uri: string; title: string } => web !== undefined && web.uri !== '' && web.title !== '')
            .map(web => ({ uri: web.uri, title: web.title }));
        
        return { text, sources };

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to fetch data from Gemini API. Please check your connection and API key.");
    }
}
