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
                        { text: 'Generate a creative and unique image generation prompt. The prompt should be for restyling the photo. The prompt should use inspiration from either one of these themes: artistic creative (digital) style, vintage comic style, anime, cartoon, collectible (designer) toy. The prompt should be simple and pick a different theme each generation' }
                    ]
                }
            ],
            systemInstruction: {
                parts: [
                    {text: "You are a creative prompt generator. Your task is to generate a single, concise, and creative image generation prompt based on the user's request. Do not add any extra text, conversation, or introductory phrases like 'Here's a creative...'. Only output the prompt itself."}
                ]
            }
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

        return res.status(200).json({ prompt: promptText.trim() });
    } catch (error) {
        console.error("Failed to generate prompt:", error);
        return res.status(500).json({ error: 'Failed to generate a new prompt. Please try again later.' });
    }
}

