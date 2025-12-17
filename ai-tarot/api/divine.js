// api/divine.js
// Vercel 会自动把这个文件识别为一个云函数接口
const OpenAI = require('openai');

const openai = new OpenAI({
    // ⭐️ 重点：这里不要写死 Key，而是用环境变量 process.env
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com',
});

// Vercel Serverless Function 的标准写法
export default async function handler(req, res) {
    // 允许跨域 (CORS) - 这样你的前端才能访问
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // 处理预检请求 (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { question, card } = req.body;

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "你是一位神秘而智慧的塔罗牌占卜师..." // 保持你之前的 Prompt
                },
                {
                    role: "user",
                    content: `我的问题是：“${question}”。我抽到的牌是：“${card}”。请为我解读。`
                }
            ],
            model: "deepseek-chat",
        });

        const reply = completion.choices[0].message.content;
        res.status(200).json({ success: true, data: reply });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}