export default async function handler(req, res) {

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {

    const {
      firstName
    } = req.body;

    const lastName = "";

    const bvn = process.env.REGISTRATION_NUMBER;

    const response = await fetch(
      "https://mevonpay.com.ng/V1/createtempva",
      {
        method: "POST",
        headers: {
          Authorization: process.env.MEVON_SECRET_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({

          type: "rubies",

          fname: firstName,

          lname: lastName,

          registration_number: bvn

        })
      }
    );

    const text = await response.text();

    let data;

    try {

      data = JSON.parse(text.trim());

    } catch {

      return res.status(500).json({
        success: false,
        message: "Non JSON response",
        response: text
      });

    }

    if (!response.ok || !data.status) {

      return res.status(400).json({
        success: false,
        message: data.message || "Unable to generate account",
        response: data
      });

    }

    return res.status(200).json({

      success: true,

      amount: 14000,

      account_number: data.account_number,

      account_name: data.account_name,

      bank_name: data.bank_name,

      reference: data.reference,

      expiresAt: Date.now() + (30 * 60 * 1000)

    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }

}
