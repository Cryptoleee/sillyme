const { GEMINI_API_KEY } = process.env;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const payload = {
            contents: [
                {
                    parts: [
                        { text: 'Generate one single, concise, creative, and unique image generation prompt. The prompt should be for restyling a photo of a person or the person itself. Use inspiration from artistic creative (digital) styles, well known vintage comic style, anime, cartoon or collectible toys in a fitting scene. The prompt should be detailed but not overly long. Do not use generic words like "portrait" or "image".' }
                    ]
                }
            ]
        };

        const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }

        const result = await response.json();
        const promptText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!promptText) {
            throw new Error('No prompt text received from API.');
        }

        return res.status(200).json({ prompt: promptText });
    } catch (error) {
        console.error("Failed to generate prompt:", error);
        return res.status(500).json({ error: 'Failed to generate a new prompt. Please try again later.' });
    }
}
