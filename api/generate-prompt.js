const { GEMINI_API_KEY } = process.env;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent";

const themes = {
    'Cartoon': {
        '80s/90s Cartoon': {
            influence: 'the bold, blocky art style of cartoons like _He-Man and the Masters of the Universe_',
            elements: 'vibrant, high-contrast colors and a heroic, fantastical feel'
        },
        'Hanna-Barbera style': {
            influence: 'classic Hanna-Barbera cartoons like _The Flintstones_ or _Scooby-Doo_',
            elements: 'simple, clean linework and a flat, limited color palette'
        }
    },
    'Anime': {
        'Akira': {
            influence: 'the gritty, futuristic cyberpunk world of _Akira_',
            elements: 'dark, moody color palettes, a sense of kinetic motion, and intricate, mechanical details'
        },
        'Studio Ghibli': {
            influence: 'the soft, painterly aesthetic of Studio Ghibli films like _My Neighbor Totoro_',
            elements: 'lush, hand-painted backgrounds and a warm, fantastical atmosphere'
        }
    },
    'Vintage Comic Style': {
        'Golden Age Comics': {
            influence: 'the early _Spider-Man_ comics from the 1960s',
            elements: 'bold, clean linework, a limited, vibrant color palette, and a sense of dynamic action'
        },
        'Noir style': {
            influence: 'Frank Miller\'s _Sin City_ comics',
            elements: 'high-contrast black and white, stark shadows, and a grim, gritty feel'
        }
    },
    'Collectible Toy': {
        'LEGO minifigure': {
            influence: 'the blocky, simplistic design of the LEGO toy line',
            elements: 'smooth, plastic textures, exaggerated proportions, and a modular, interlocking feel'
        },
        'Funko Pop': {
            influence: 'the oversized head and small body of a Funko Pop figure',
            elements: 'a glossy finish, black button eyes, and a minimalist, stylized look'
        }
    },
    'Art Style': {
        'Surrealism': {
            influence: 'the dreamlike works of Salvador Dalí',
            elements: 'distorted, illogical imagery, melting objects, and a sense of the uncanny'
        },
        'Pop Art': {
            influence: 'the iconic style of Andy Warhol',
            elements: 'bold colors, repeated imagery, and a flat, screen-printed appearance'
        }
    }
};

function getRandomPrompt() {
    const themeNames = Object.keys(themes);
    const randomThemeName = themeNames[Math.floor(Math.random() * themeNames.length)];
    const subStyles = themes[randomThemeName];
    const subStyleNames = Object.keys(subStyles);
    const randomSubStyleName = subStyleNames[Math.floor(Math.random() * subStyleNames.length)];
    const selectedStyle = subStyles[randomSubStyleName];

    const promptText = `A photo restyled in the style of a ${randomThemeName}, with the specific aesthetic of ${randomSubStyleName} and influenced by ${selectedStyle.influence}. The style should be characterized by ${selectedStyle.elements}.`;
    
    return promptText;
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const prompt = getRandomPrompt();

        const payload = {
            contents: [
                {
                    parts: [
                        { text: prompt }
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
