import fetch from "node-fetch";

export default async function handler(req, res) {
  const { prompt, history } = req.body;

  const messages = [
    { role: "system", content: "You are a helpful AI assistant." },
    ...(history || []),
    { role: "user", content: prompt }
  ];

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
}
