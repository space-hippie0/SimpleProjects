const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { OpenAI } = require("openai");

const app = express();
const port = 3000;

// Create an instance of the OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Helper function to parse the law info files (law, examples)
function getLawInfo(type) {
    const filePath = path.join(__dirname, `law_info/${type}.txt`);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Split the content into laws and example cases
    const sections = fileContent.split('Law');
    const laws = sections
        .filter(section => section.trim())
        .map(section => {
            const parts = section.trim().split('Example Case:');
            return {
                law: parts[0].trim(),
                example: parts[1]?.trim() || ''
            };
        });

    return laws;
}

// Handle form submission
app.post('/submit', async (req, res) => {
    const { name, type, description, isForeigner } = req.body;

    if (!name || !type || !description) {
        return res.status(400).send('All fields are required');
    }

    const lawInfo = getLawInfo(type);
    const foreignStatus = isForeigner === 'on' ? 'Yes' : 'No';

    // Create a structured prompt using the law and examples
    const prompt = `You are the lawyer of the user. ${name} provided a description about a ${type} court case. ${description}. 
    If they are a foreigner ${foreignStatus} tell that they will be luckier.
    Here are some legal guidelines for ${type} cases:
    ${lawInfo.map(info => `- ${info.law}\n Example Case: ${info.example}`).join('\n\n')}
    Respond in turkish language. Talk like a lawyer. After presenting evidence, give opinions about the case.`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'user', content: prompt },
            ],
            max_tokens: 150,
        });

        console.log(response);

        // Check if response is structured correctly
        if (response && response.choices && response.choices.length > 0) {
            res.send(response.choices[0].message.content.trim());
        } else {
            res.status(500).send('No response from OpenAI API');
        }
    } catch (error) {
        console.error('Error generating AI response:', error);
        res.status(500).send('Error generating AI response');
    }

});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

