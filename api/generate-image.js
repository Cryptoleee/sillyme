const fetch = require('node-fetch');

module.exports = async (req, res) => {
    try {
        const geminiApiKey = process.env.GEMINI_API_KEY;
        if (!geminiApiKey) {
            return res.status(500).json({ error: "API key is not set." });
        }

        const { prompt, imageData, mimeType } = req.body;
        
        if (!prompt || !imageData || !mimeType) {
            return res.status(400).json({ error: "Missing prompt, image data, or mime type." });
        }
        
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${geminiApiKey}`;

        const payload = {
            contents: [{
                parts: [
                    { text: `Return a restyling of the provided image as: ${prompt}` },
                    {
                        inlineData: {
                            mimeType: mimeType,
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
            try {
                // Try to parse the error for a more specific message from the API
                const errorJson = JSON.parse(errorText);
                if (errorJson.error && errorJson.error.message) {
                    throw new Error(errorJson.error.message);
                }
            } catch (e) {
                 // If parsing fails, use the raw text
                throw new Error(`API error: ${apiResponse.status} - ${errorText}`);
            }
        }

        const result = await apiResponse.json();

        // Check for safety blocks or other reasons for an empty response
        if (!result.candidates || result.candidates.length === 0) {
            if (result.promptFeedback && result.promptFeedback.blockReason) {
                return res.status(400).json({ error: `Image generation blocked. Reason: ${result.promptFeedback.blockReason}` });
            } else {
                return res.status(500).json({ error: "No image data received from API, and no block reason was provided." });
            }
        }

        res.json(result);

    } catch (error) {
        console.error("Error in serverless function:", error);
        res.status(500).json({ error: error.message });
    }
};

