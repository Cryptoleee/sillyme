const { GEMINI_API_KEY } = process.env;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent";

const themes = {
    'Cartoon': ['90s cartoon', 'Animaniacs', 'Dexter\'s Laboratory', 'X-Men: The Animated Series', 'Rugrats'],
    'Anime': ['Naruto', 'One Piece', 'Dragon Ball Z', 'Akira', 'One Punch Man', 'Shin-chan'],
    'Vintage Comic Style': ['Marvel comics', 'DC comic', 'Spider-man', 'Batman', 'Teenage Mutant Ninja Turtle comics'],
    'Collectible Toy': ['LEGO minifigure', 'Funko Pop'],
    'Art Style': ['Bauhaus', 'Baroque', 'Expressionism', 'Surrealism', '16 bit SNES pixel art', 'MS Dos art']
};

function getInspiration() {
    const themeNames = Object.keys(themes);
    const randomThemeName = themeNames[Math.floor(Math.random() * themeNames.length)];
    const styles = themes[randomThemeName];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    return `A restyling in the style of: ${randomStyle}`;
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const inspiration = getInspiration();

        const payload = {
            contents: [
                {
                    parts: [
                        { text: `Based on the following inspiration: "${inspiration}", generate a concise and direct prompt to restyle a photo. The prompt must be a single sentence describing a tangible art style, medium, or object. Do not ask for text, grids, or multiple scenes. For example: 'Restyle the photo in the style of a 16-bit SNES pixel art character.'` }
                    ]
                }
            ],
            systemInstruction: {
                parts: [
                    { text: "You are an expert prompt generator for an AI image model. Your only task is to generate a single, concise image generation prompt. Absolutely no extra text, no conversation, no introductions like 'Here's a creative prompt:'. Only output the prompt itself. The output must be a single, direct instruction." }
                ]
            }
        };

        const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("API Error Body:", errorBody);
            throw new Error(`API call failed with status: ${response.status}`);
        }

        const result = await response.json();
        const promptText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!promptText) {
            throw new Error('No prompt text received from API.');
        }

        const cleanedPrompt = promptText.trim().replace(/^"|"$/g, '');

        return res.status(200).json({ prompt: cleanedPrompt });

    } catch (error) {
        console.error("Failed to generate prompt:", error);
        return res.status(500).json({ error: 'Failed to generate a new prompt. Please try again later.' });
    }
}
