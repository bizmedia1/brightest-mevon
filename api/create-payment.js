export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const response = await fetch(
      "https://mevonpay.com.ng/V1/createdynamic",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.MEVON_SECRET_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: 14000,
          currency: "NGN"
        })
      }
    );

    const text = await response.text();

    let parsed;

    try {
      const result = JSON.parse(text);
      parsed = result.raw ? JSON.parse(result.raw) : result;
    } catch {
      return res.status(500).json({
        error: text
      });
    }

    return res.status(200).json(parsed);

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
