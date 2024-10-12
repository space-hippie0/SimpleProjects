// Load environment variables from .env file
require('dotenv').config();
const { OpenAI } = require("openai");

// Create an instance of the OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Define the function to make the API call
async function askChatGPT(userInput) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userInput }],
        });

        const message = response.choices[0].message.content;
        return message; // Return the response to the caller
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        return "Sorry, there was an error processing your request.";
    }
}

// Expose the function to the client-side using an Express server
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public')); // Serve static files from the public directory
app.use(express.json()); // Parse JSON bodies

// API endpoint to handle chat requests
app.post('/chat', async (req, res) => {
    const userInput = req.body.input;
    const responseMessage = await askChatGPT(userInput);
    res.json({ response: responseMessage });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


