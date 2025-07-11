export default async function handler(req, res) {
  const { message } = req.body;

  const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.HF_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: message })
  });

  const data = await response.json();

  let reply;

  if (Array.isArray(data) && data[0]?.generated_text) {
    reply = data[0].generated_text.trim();
  } else if (typeof data.generated_text === "string") {
    reply = data.generated_text.trim();
  } else if (data.error) {
    reply = `Model error: ${data.error}`;
  } else {
    reply = "No response from AI model.";
  }

  res.status(200).json({ reply });
}
