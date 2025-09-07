const { GEMINI_API_KEY } = process.env;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent";

const prompts = [
    'A portrait of a person crudely sculpted from a mixture of old chewing gum, crushed candy wrappers, and sprinkles, melting slightly on a piece of greasy wax paper.',
    'A portrait as if created with layers of dry autumn leaves and twigs, pressed onto a rustic paper background.',
    'A portrait of a person made of tiny, colorful Lego bricks, with visible studs and a perfectly symmetrical, blocky aesthetic.',
    'A portrait made from intricately arranged grains of rice, black sesame seeds, and small pieces of seaweed on a smooth, white porcelain plate.',
    'A portrait as a whimsical scene made from a child\'s colorful building blocks, with the face and features formed by the blocks\' shapes and shadows.',
    'A portrait made with hundreds of colorful, fluttering monarch butterflies, where the shapes of their wings form the person\'s features.',
    'A portrait of a person as a stylized mosaic of various fruit slices and vegetable scraps on a wooden cutting board.',
    'A portrait as if made from a tangle of different-colored neon glow-in-the-dark wires, creating a futuristic and chaotic web of light against a dark background.',
    'A portrait of a person as a ghostly image formed by swirling smoke and wisps of vapor.',
    'A portrait as a vibrant oil painting on a cracked, ancient stone wall, with the colors bleeding into the natural fissures and textures of the rock.',
    'A portrait made of meticulously folded origami paper, with sharp creases and geometric shapes forming the facial features.',
    'A portrait of a person made entirely of swirling, colorful latte art foam in a white ceramic mug.',
    'A portrait as a sculpture made of melting ice, with water droplets trickling down and distorting the features.',
    'A portrait as a stained glass window, with thick black lines separating vibrant, jewel-toned shards of glass.'
];

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const randomIndex = Math.floor(Math.random() * prompts.length);
    const randomPrompt = prompts[randomIndex];

    return res.status(200).json({ prompt: randomPrompt });
}
