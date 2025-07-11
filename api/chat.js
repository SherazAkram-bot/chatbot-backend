export default async function handler(req, res) {
  const { message } = req.body;

  const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.HF_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: message
    })
  });

  const data = await response.json();
  const reply = data?.[0]?.generated_text || "Sorry, I couldn't generate a response.";
  res.status(200).json({ reply });
}
