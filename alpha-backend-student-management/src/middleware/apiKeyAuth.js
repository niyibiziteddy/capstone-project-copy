import crypto from "crypto";

const apiKeyAuth = (req, res, next) => {
  const providedKey= req.get("API-Key");
  const secretKey = process.env.API_SECRET_KEY;

  if (!secretKey) {
    console.error("API_SECRET_KEY is not configured");

    return res.status(500).json({
      message: "server security configuration error",
    });
  }

  if (!providedKey) {
    return res.status(401).json({
      message: "API key is required",
    });
  }

  const providedBuffer = Buffer.from(providedKey);
  const secretBuffer = Buffer.from(secretKey);

  if (
    providedBuffer.length !== secretBuffer.length ||
    !crypto.timingSafeEqual(providedBuffer, secretBuffer)
  ) {
    return res.status(401).json({
      message: "Invalid API key",
    });
  }

  next();
};

export default apiKeyAuth;
