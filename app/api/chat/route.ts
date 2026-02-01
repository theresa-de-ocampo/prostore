import { loadContext } from "@/lib/actions/knowledge.action";
import { selectContextScopes } from "@/lib/ai";
import { streamText, UIMessage, convertToModelMessages } from "ai";

export async function POST(req: Request) {
  let response: Response;

  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const lastUserMessage = messages.findLast(
      (message) => message.role === "user"
    );

    if (lastUserMessage?.parts[0]?.type === "text") {
      const userInput = lastUserMessage.parts[0].text;
      const contextScopes = selectContextScopes(userInput);
      const knowledge = await loadContext(contextScopes);

      let system = knowledge.base;

      if (knowledge.matched.length > 0) {
        system = `${system}\n\n${knowledge.matched.map((match) => match.content).join("\n\n")}`;
      }

      const result = streamText({
        model: "openai/gpt-5-chat",
        system,
        messages: await convertToModelMessages(messages)
      });

      response = result.toUIMessageStreamResponse();
    } else {
      response = Response.json("Last message must be a text user message.", {
        status: 400
      });
    }
  } catch {
    response = Response.json("Failed to process chat request.", {
      status: 500
    });
  }

  return response;
}
