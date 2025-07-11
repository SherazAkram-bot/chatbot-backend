export default async function handler(req, res) {
  const { message } = req.body;

  const response = await fetch("https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.HF_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: message,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.7
      }
    })
  });

  const data = await response.json();

  let reply;

  if (Array.isArray(data) && data[0]?.generated_text) {
    reply = data[0].generated_text.trim();
  } else if (data.generated_text) {
    reply = data.generated_text.trim();
  } else if (data.error) {
    reply = `Hugging Face Error: ${data.error}`;
  } else {
    reply = "Sorry, I couldn't generate a response.";
  }

  res.status(200).json({ reply });
}
