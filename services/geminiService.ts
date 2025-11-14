import { GoogleGenAI } from "@google/genai";
import type { GroundingChunk, Source, ChartDataItem } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface FetchResult {
    text: string;
    summary: string;
    sources: Source[];
    chartData: ChartDataItem[];
    knowledgeTags: string[];
}

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error("Failed to convert blob to base64"));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
    const model = 'gemini-2.5-flash';
    try {
        const audioData = await blobToBase64(audioBlob);
        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [
                    { inlineData: { mimeType: audioBlob.type, data: audioData } },
                    { text: "Transcribe the following audio." }
                ]
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for transcription:", error);
        throw new Error("Failed to transcribe audio. Please try again.");
    }
}

export async function fetchPatentInfo(query: string): Promise<FetchResult> {
    const model = 'gemini-2.5-flash';
    
    const prompt = `You are an expert patent researcher and engineering mentor. Your goal is to provide educational, self-teaching guidance. Based on the user's query about "${query}", conduct a deep dive using your search tools to find relevant patents.

First, start your response with a section titled "Patent Pulse:" formatted as a brief, engaging news report (2-3 sentences) summarizing the most critical findings of your research. This should be a standalone paragraph.

Then, explain the core principles and technology behind the patents in a clear, accessible way. Finally, outline a step-by-step guide on how someone could create a basic prototype based on the publicly available information. Format the main body of your response in clear, well-structured Markdown.

After the main markdown response, you MUST include a JSON object enclosed in a single \`\`\`json code block. Do not include any text after this JSON block.
The JSON object should have this exact structure:
{
  "chartData": [
    { "name": "Some Metric", "value": 10 },
    { "name": "Another Metric", "value": 25 }
  ],
  "knowledgeTags": ["Tech Field 1", "Science Concept 2", "Engineering Skill 3"]
}

- For 'chartData', provide a simple dataset (4-6 items) that visualizes a key trend from your research.
- For 'knowledgeTags', list 3-5 essential fields of knowledge required to understand the core technology.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const fullText = response.text;
        let text = fullText;
        let summary = '';
        let chartData: ChartDataItem[] = [];
        let knowledgeTags: string[] = [];
        
        const summaryRegex = /^Patent Pulse:\s*([\s\S]*?)\n\n/i;
        const summaryMatch = fullText.match(summaryRegex);
        if (summaryMatch && summaryMatch[1]) {
            summary = summaryMatch[1].trim();
            text = text.replace(summaryRegex, '');
        }

        const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/;
        const jsonMatch = text.match(jsonBlockRegex);

        if (jsonMatch && jsonMatch[1]) {
            try {
                const parsedJson = JSON.parse(jsonMatch[1]);
                if (parsedJson.chartData && Array.isArray(parsedJson.chartData)) {
                    chartData = parsedJson.chartData;
                }
                if (parsedJson.knowledgeTags && Array.isArray(parsedJson.knowledgeTags)) {
                    knowledgeTags = parsedJson.knowledgeTags;
                }
                text = text.replace(jsonBlockRegex, '').trim();
            } catch (e) {
                console.error("Failed to parse JSON from response:", e);
            }
        }

        const groundingChunks: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources: Source[] = groundingChunks
            .map(chunk => chunk.web)
            .filter((web): web is { uri: string; title: string } => web !== undefined && web.uri !== '' && web.title !== '')
            .map(web => ({ uri: web.uri, title: web.title }));
        
        return { text, summary, sources, chartData, knowledgeTags };

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to fetch data from Gemini API. Please check your connection and API key.");
    }
}