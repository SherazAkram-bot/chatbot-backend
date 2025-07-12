export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { message, lang, history } = req.body;
  const browserLang = lang || "en";

  // Generate Shopify product list (or mock for now)
  const productList = `
- Smart Charger Pro — USB-C fast charger — $29.99
- Wireless Earbuds — Waterproof, noise-canceling — $49.99
- Scented Candle Set — Relaxing aroma — $19.99
  `;

  const systemPrompt = `
You are a friendly, helpful Shopify assistant for "Ecom Staff Testing".

Your job:
- Answer customer support queries about products, shipping, returns, or contact info
- Pull from the current product list and policies below
- Always be polite and natural — sound like a real human support rep
- Respond in ${browserLang}
  
Store Info:
- Shipping: 3–5 business days
- Returns: 14 days if unused
- Email: support@ecomstaff.com

Product List:
${productList}
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          ...(history || []),
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ reply: "Server error. Try again later." });
  }
}
