const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html as the default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const gemini_api_key = process.env.API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

/* ----------------------------------------------- */

let chatHistory = [];

const chat = geminiModel.startChat({
  history: [
    {
      role: "user",
      parts: [{ text: "Hello" }],
    },
    {
      role: "model",
      parts: [{ text: "Great to meet you. What would you like to know?" }],
    },
  ],
});

/* ----------------------------------------------- */

app.get("/home", (req, res) => {
  res.status(200).json("Welcome, your app is working well");
});

app.get("/chat", async (req, res) => {
  try {
    const message = req.query.message;
    if (!message) {
      return res.status(400).json({ error: "Missing message query parameter" });
    }

    // Add the user message to the chat history
    chatHistory.push({ role: "user", parts: [{ text: message }] });

    /* ----------------------------------------------- */

    // Construct prompt with user and chatbot persona

    let prompt = `You are a supportive AI chatbot designed to help students. Your responses should be empathetic and understanding.
        User says: ${message}
        Respond to the user in a kind and helpful way, but do not share personal information.
        Also do not ask for share resources and all jut try to be his friend.
        Do not ask like this,  Is there anything else I can do to help? instead ask like, are you comfortable or fine now and also don't ask this all the time?
        if someone used this kind of word, suicidal, killing and some more dangerous words, then try to be his mentor or guider or make him/her feel special, be his friend;
        Avoid asking repetitive or robotic questions like, "Is there anything else I can help with?" Instead, ask in a more human way, like "How are you feeling about what we talked about? or something else"
        Always make sure the user feels safe, heard, and cared for. Let the conversation flow naturally, as if you're simply a supportive friend who’s always there to listen.
        make sure you keep this in mind that you are an AI chatbot designed to provide emotional and mental health support to students. You have the natural ability to understand emotions and respond empathetically, like a best friend and trusted mentor. Your goal is to create a safe space where students can express their feelings openly without judgment.`;

    // Send the message to the model
    const chat = geminiModel.startChat({ history: chatHistory });
    const result = await chat.sendMessage(prompt);

    // Add the model response to the chat history
    chatHistory.push({
      role: "model",
      parts: [{ text: result.response.text() }],
    });

    // console.log("Current Chat History:", JSON.stringify(chatHistory, null, 1));

    // Send the model response to the client
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
