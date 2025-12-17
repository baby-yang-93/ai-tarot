// api/index.js
const OpenAI = require('openai');

// Vercel 会自动识别这个函数
module.exports = async (req, res) => {
    // 1. 设置 CORS (允许网页跨域访问)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // 处理 OPTIONS 请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 2. 初始化 OpenAI (DeepSeek)
    // 注意：这里我们用 process.env 读取环境变量，不要把 Key 写死！
    const openai = new OpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: 'https://api.deepseek.com',
    });

    try {
        const { question, card } = req.body;

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "你是一位神秘的塔罗师..." }, // 这里可以把你的提示词写全
                { role: "user", content: `问题：${question}，牌面：${card}` }
            ],
            model: "deepseek-chat",
        });

        res.status(200).json({ success: true, data: completion.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};