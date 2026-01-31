import { loadContext } from "@/lib/actions/knowledge.action";
import { selectContextScopes } from "@/lib/ai";
import { streamText, UIMessage, convertToModelMessages } from "ai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const lastUserMessage = messages.findLast(
    (message) => message.role === "user"
  );

  if (lastUserMessage?.parts[0].type === "text") {
    const userInput = lastUserMessage.parts[0].text;
    const contextScopes = selectContextScopes(userInput);
    const knowledge = await loadContext(contextScopes);
    console.log(knowledge);

    let system = knowledge.base;

    if (knowledge.matched.length > 0) {
      system = `${system}\n\n${knowledge.matched.join("\n\n")}`;
    }

    console.log(system);
  }

  const result = streamText({
    model: "openai/gpt-4.1",
    messages: await convertToModelMessages(messages)
  });

  return result.toUIMessageStreamResponse();
}
