const fetch = require('node-fetch');

module.exports = async (req, res) => {
    try {
        const geminiApiKey = process.env.GEMINI_API_KEY; // Access the secure environment variable

        if (!geminiApiKey) {
            return res.status(500).json({ error: "API key is not set." });
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`;
        
        const systemPrompt = "Generate a single, unique, bizarre, and silly style prompt for an image generation model to transform a portrait. The prompt should be a wild, creative combination of a subject and a material or theme. It should result in a restyling of the original photo, not a new creation. The prompts should sound like a mix of an art school critique and a fever dream. Examples include: 'a vibrant portrait of a person made entirely from a mosaic of melted gummy bears, dripping slightly onto a white surface,' or 'a hyper-realistic sculpture of a person's face carved from a single, giant block of swiss cheese, with holes and cracks revealing a starry night sky inside,' or 'a portrait of a person as if they were a mischievous monkey wearing a tiny suit, sketched on a napkin with a pen.' The output should be only the prompt string and nothing else.";
        const userQuery = "Create a new weird and silly style prompt.";

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            }
        };

        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            throw new Error(`API error: ${apiResponse.status} - ${errorText}`);
        }

        const result = await apiResponse.json();
        res.json(result);

    } catch (error) {
        console.error("Error in serverless function:", error);
        res.status(500).json({ error: error.message });
    }
};
