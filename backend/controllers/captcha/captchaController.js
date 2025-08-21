import fetch from "node-fetch";

export const verifyCaptcha = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: "No token provided" });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
      { method: "POST" }
    );

    const data = await response.json();

    if (data.success) {
      return res.json({ success: true, message: "Captcha verified" });
    } else {
      return res.status(400).json({ success: false, message: "Captcha verification failed", errors: data["error-codes"] });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
