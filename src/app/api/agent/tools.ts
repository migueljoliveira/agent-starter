// app/api/agent/tools.ts

import type { ChatCompletionTool } from "openai/resources/chat/completions";

// Tools available to the AI agent
export const tools: ChatCompletionTool[] = [
  {
  type: "function",
  function: {
    name: "calculator",
    description: "Evaluate basic math expressions",
    parameters: {
      type: "object",
      properties: {
        expression: { type: "string" },
      },
      required: ["expression"],
    },
  },
  },

// Weather Tool Definition
{
  type: "function",
  function: {
    name: "getWeather",
    description: "Get the weather for a given location and date",
    parameters: {
      type: "object",
      properties: {
        location: { type: "string" },
        date: { type: "string" },
      },
      required: ["location", "date"],
    },
  },
},

// Joke Tool Definition
{
  type: "function",
  function: {
    name: "tellJoke",
    description: "Return a random programming joke",
    parameters: {
      type: "object",
      properties: {},
    },
  },
}

  
];

// Tool implementations (to be added later)
export async function runTool(name: string, args: any) {
  if (name === "calculator") {
    try {
      // ⚠️ demo only — eval is unsafe in production
      // eslint-disable-next-line no-eval
      return eval(args.expression);
    } catch {
      return "Error evaluating expression";
    }
  }
  
  // Weather + Joke Implementations
  if (name === "getWeather") {
    return { forecast: "Rainy", temperature: "15°C" };
  }

  if (name === "tellJoke") {
    const jokes = [
      "Why do programmers prefer dark mode? Because light attracts bugs.",
      "There are 10 types of people in the world: those who understand binary and those who don’t.",
      "I would tell you a UDP joke, but you might not get it.",
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }
  return "Unknown tool";
} 
