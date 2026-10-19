import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  console.log("Message received from frontend!");

  const messages = req.body.messages || [];
  const lastMessage = messages[messages.length - 1];

  let userText = "";

  if (lastMessage?.parts) {
    const textPart = lastMessage.parts.find(
      (part) => part.type === "text"
    );

    if (textPart) {
      userText = textPart.text;
    }
  }

  const response =
    `Hello! 👋 You said: "${userText}". ` +
    `This is a streaming response from your AI Assistant. ` +
    `Task 5 is working successfully!`;

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const messageId = randomUUID();
      writer.write({ type: "text-start", id: messageId });

      for (const word of response.split(" ")) {
        writer.write({
          type: "text-delta",
          id: messageId,
          delta: `${word} `,
        });
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      writer.write({ type: "text-end", id: messageId });
    },
  });
  const streamResponse = createUIMessageStreamResponse({ stream });

  streamResponse.headers.forEach((value, name) => {
    res.setHeader(name, value);
  });
  res.status(streamResponse.status);
  Readable.fromWeb(streamResponse.body).pipe(res);
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});