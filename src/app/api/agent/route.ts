// app/api/agent/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { tools, runTool } from "./tools";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    
    // TODO: Call OpenAI with tools
    // Step 1: Ask GPT with tools
    // Step 2: If GPT calls a tool → run it
    // Step 3: Send result back for reasoning
    // Step 4: Return final answer

    const first= await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [{role:"user", content: query}],
      tools,
    })
    const msg = first.choices[0].message;

    // optional logging
    console.log("Tool calls:", msg.tool_calls);

  // 2) If GPT decides to call a tool
  if (msg.tool_calls?.length) {
    const results = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      msg.tool_calls.map(async (call: any) => {
        const args = JSON.parse(call.function.arguments || "{}");
        const result = await runTool(call.function.name, args);
        return { tool_call_id: call.id, result };
      })
    );

    
  // 3) Send tool outputs back for final reasoning
  const final = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      { role: "user", content: query },
      msg,
      ...results.map((r) => ({
        role: "tool" as const,
        tool_call_id: r.tool_call_id,
        content: JSON.stringify(r.result),
      })),
    ],
  });

  return NextResponse.json({
    answer: final.choices[0].message?.content || "(no answer)",
  });
}


    // Placeholder response until the agent logic is implemented
    return NextResponse.json({ answer: "Agent not implemented yet" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err: any) {
    
    console.error("API error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
