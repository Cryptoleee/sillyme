const { GEMINI_API_KEY } = process.env;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent";

const themes = {
    'Cartoon': {
        '90s Cartoon': {
            influence: 'the bold, blocky art style of 90s cartoons',
            elements: 'vibrant, high-contrast colors and a fun, animated feel'
        },
        'Animaniacs': {
            influence: 'the zany, high-energy animation of _Animaniacs_',
            elements: 'exaggerated expressions, fast-paced motion, and a rubbery, flexible feel'
        },
        'Dexter\'s Laboratory': {
            influence: 'the sharp, geometric character designs of _Dexter\'s Laboratory_',
            elements: 'a clean, angular aesthetic with a retro-futuristic vibe'
        },
        'X-Men: The Animated Series': {
            influence: 'the dramatic, action-packed style of _X-Men: The Animated Series_',
            elements: 'heavy shadows, dynamic poses, and a comic book-inspired look'
        },
        'Rugrats': {
            influence: 'the quirky, scribbly art style of _Rugrats_',
            elements: 'wobbly lines, oddly proportioned characters, and a charmingly imperfect, hand-drawn quality'
        }
    },
    'Anime': {
        'Naruto': {
            influence: 'the dynamic action scenes and distinct character designs of _Naruto_',
            elements: 'bold outlines, motion lines for speed, and vibrant chakra energy effects'
        },
        'One Piece': {
            influence: 'the exaggerated, rubbery art style of Eiichiro Oda\'s _One Piece_',
            elements: 'wildly imaginative character proportions, vibrant colors, and a sense of grand adventure'
        },
        'Dragon Ball Z': {
            influence: 'the iconic, muscular character designs and explosive energy blasts of _Dragon Ball Z_',
            elements: 'spiky hair, intense speed lines, and glowing auras'
        },
        'Akira': {
            influence: 'the gritty, futuristic cyberpunk world of _Akira_',
            elements: 'dark, moody color palettes, a sense of kinetic motion, and intricate, mechanical details'
        },
        'One Punch Man': {
            influence: 'the clean, high-impact animation style of _One Punch Man_',
            elements: 'incredibly detailed action sequences contrasted with a simple, comically understated main character'
        },
        'Shin-chan': {
            influence: 'the simple, rounded, and childlike art style of _Crayon Shin-chan_',
            elements: 'thick outlines, minimalist facial expressions, and a playful, lighthearted feel'
        }
    },
    'Vintage Comic Style': {
        'Marvel Comics': {
            influence: 'the dynamic, heroic style of classic Marvel comics',
            elements: 'Ben-Day dots for shading, bold ink lines, and dramatic action poses'
        },
        'DC Comics': {
            influence: 'the darker, more realistic art style of modern DC comics',
            elements: 'heavy use of shadow, detailed musculature, and a cinematic, gritty atmosphere'
        },
        'Spider-Man': {
            influence: 'the acrobatic, web-slinging action from classic _Spider-Man_ comics',
            elements: 'dynamic perspectives, flexible poses, and a cityscape background'
        },
        'Batman': {
            influence: 'the dark, gothic atmosphere of _Batman_ comics',
            elements: 'noir-style shadows, dramatic capes, and a moody, detective-story feel'
        },
        'Teenage Mutant Ninja Turtles Comics': {
            influence: 'the raw, gritty style of the original Eastman and Laird comics',
            elements: 'heavy cross-hatching, black-and-white art, and an underground, indie comic vibe'
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
        'Bauhaus': {
            influence: 'the geometric shapes and functional design of the Bauhaus movement',
            elements: 'clean lines, primary colors, and a focus on form and structure'
        },
        'Baroque': {
            influence: 'the dramatic, ornate style of the Baroque period',
            elements: 'rich colors, intense light and dark shadows, and a sense of grandeur and movement'
        },
        'Expressionism': {
            influence: 'the distorted, emotional style of German Expressionism',
            elements: 'swirling, exaggerated brushstrokes, intense colors, and a focus on subjective reality'
        },
        'Surrealism': {
            influence: 'the dreamlike works of Salvador Dalí',
            elements: 'distorted, illogical imagery, melting objects, and a sense of the uncanny'
        },
        '16-bit SNES Pixel Art': {
            influence: 'the pixelated graphics of a 16-bit Super Nintendo game',
            elements: 'a limited color palette, blocky character sprites, and a nostalgic, retro video game feel'
        },
        'MS-DOS Art': {
            influence: 'the low-resolution, dithering art style of old MS-DOS games',
            elements: 'a very limited palette (like EGA or CGA), pixelated graphics, and a distinctly retro computer aesthetic'
        }
    }
};

function getInspiration() {
    const themeNames = Object.keys(themes);
    const randomThemeName = themeNames[Math.floor(Math.random() * themeNames.length)];
    const subStyles = themes[randomThemeName];
    const subStyleNames = Object.keys(subStyles);
    const randomSubStyleName = subStyleNames[Math.floor(Math.random() * subStyleNames.length)];
    const selectedStyle = subStyles[randomSubStyleName];
    return `Theme: ${randomThemeName}, Style: ${randomSubStyleName}, Influence: ${selectedStyle.influence}, Elements: ${selectedStyle.elements}.`;
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
                        { text: `Generate a single, creative, and unique image generation prompt suitable for an AI image model. The prompt should be for restyling a photo. Use the following as inspiration but create something entirely new and surprising: "${inspiration}". The final prompt should be a single, concise instruction without any conversational text or explanations.` }
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

