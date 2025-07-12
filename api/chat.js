// export default async function handler(req, res) {
//   // ✅ Allow CORS
//   res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all domains (or restrict to specific domain if needed)
//   res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   // ✅ Handle preflight request (important!)
//   if (req.method === "OPTIONS") {
//     return res.status(200).end();
//   }

//   const { message } = req.body;

//   const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//     method: "POST",
//     headers: {
//       "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       model: "mistralai/mistral-7b-instruct",
//       messages: [
//         { role: "system", content: "You are a helpful assistant." },
//         { role: "user", content: message }
//       ],
//       temperature: 0.7
//     })
//   });

//   const data = await response.json();
//   const reply = data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
//   res.status(200).json({ reply });
// }

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { message } = req.body;

  const promptContext = `
You are a helpful and friendly customer support assistant for the Shopify store "Ecom Staff Testing".

Your job is to help customers with:
-  Order questions, returns, and delivery
-  Product-specific details
-  Policy page answers (return & shipping)
-  Language-aware replies (use user's language)

Store Info:
-  Shipping: We ship all orders within 3–5 business days via DHL.
-  Returns: Customers can return products within 14 days if unused and in original packaging.
-  Support: Reach us at support@ecomstaff.com

Product Info:
-  Smart Charger Pro – USB-C Fast Charging Adapter – $29.99
-  Scented Candle Set – Relaxing aroma for home – $19.99
-  Wireless Earbuds – Waterproof, noise-canceling – $49.99

Always respond politely, never say you're an AI.
Always act like a real human assistant from the store.
If a user types in another language (e.g. Urdu, Arabic, Spanish), respond in the same language.
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
          { role: "system", content: promptContext },
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ reply: "Something went wrong on the server." });
  }
}

