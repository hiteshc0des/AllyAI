# My Chat Application with Generative AI

This project demonstrates a simple chat application powered by Google Generative AI (specifically the gemini-1.5-flash model). It allows users to send messages and receive responses from the model designed to be supportive.

## Setup

1. Install dependencies:

   npm install express body-parser dotenv

2. Create a .env file at the root of your project and add your Google Generative AI API Key:
   API_KEY=YOUR_API_KEY

3. API Endpoints:

Document the available API endpoints:
/home (GET): Returns a success message.
/chat (GET): Takes a "message" query parameter and returns a response from the large language model.
