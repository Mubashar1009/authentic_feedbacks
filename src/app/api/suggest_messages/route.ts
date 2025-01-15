import { OpenAI, openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages, AISDKError } from "ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by `||`. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive  topics, focusing instead on universal themes that encourage friendly interactions. For example, your output should be structured like this: ‘What’s a hobby yo’ve recently started? || If you could have dinner with any historical figure, who would it be?|| What’s a simple thing that makes you happy?’. Ensure the questions are intriguing, foster curiosity, and contribute to a positive  and welcoming conversational environment. “ ";
    const result = await streamText({
      model: openai("gpt-4-turbo-instruct"),

      maxTokens: 499,

      prompt,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.log("Error: ", error);

    if (error instanceof AISDKError) {
      const { name, message } = error;

      return NextResponse.json(
        {
          name,
          message,
        },
        { status: 500 }
      );
    }
  }
}
