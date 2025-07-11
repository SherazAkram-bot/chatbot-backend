export default async function handler(req, res) {
  const { message } = req.body;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct", // or try "openai/gpt-3.5-turbo"
      messages: [
        { role: "system", content: "You are a helpful chatbot assistant." },
        { role: "user", content: message }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();

  const reply = data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
  res.status(200).json({ reply });
}
