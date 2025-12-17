// server.js
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors()); // 允许跨域
app.use(express.json()); // 解析 JSON 请求体

// ⭐️ 初始化 DeepSeek (完全兼容 OpenAI 协议)
const openai = new OpenAI({
    apiKey: 'sk-90a3b7f9493b44cbac3293eaf7eab38d', // <--- 替换成你刚申请的 Key
    baseURL: 'https://api.deepseek.com',
});

// 你的核心接口
app.post('/api/divine', async (req, res) => {
    try {
        const { question, card } = req.body;
        console.log(`收到请求 - 问题: ${question}, 牌面: ${card}`);

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "你是一位神秘而智慧的塔罗牌占卜师。请根据用户抽到的塔罗牌，结合用户心中的疑惑，给出一段不超过200字的解读。语气要温柔、治愈，给人指引方向。"
                },
                {
                    role: "user",
                    content: `我的问题是：“${question}”。我抽到的牌是：“${card}”。请为我解读。`
                }
            ],
            model: "deepseek-chat",
        });

        const reply = completion.choices[0].message.content;
        res.json({ success: true, data: reply });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: '大师正在冥想，请稍后再试' });
    }
});

// 启动服务器
app.listen(3000, () => {
    console.log('🔮 占卜屋已开张: http://localhost:3000');
});