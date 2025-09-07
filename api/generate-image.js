const fetch = require('node-fetch');

module.exports = async (req, res) => {
    try {
        const { prompt, imageData } = req.body;
        const geminiApiKey = process.env.GEMINI_API_KEY; // Access the secure environment variable

        if (!geminiApiKey) {
            return res.status(500).json({ error: "API key is not set." });
        }

        const combinedPrompt = `Return a restyling of the provided image as: ${prompt}`;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${geminiApiKey}`;

        const payload = {
            contents: [{
                parts: [
                    { text: combinedPrompt },
                    {
                        inlineData: {
                            mimeType: "image/png",
                            data: imageData
                        }
                    }
                ]
            }],
            generationConfig: {
                responseModalities: ["IMAGE"],
            },
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
