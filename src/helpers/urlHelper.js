const URL = require("../models/URL");
const Analytics = require("../models/Analytics");
const axios = require("axios");

const shortenUrlService = async (originalUrl) => {
    const { nanoid } = await import("nanoid");
    const shortUrl = nanoid(8);
    const newUrl = await URL.create({
        originalUrl,
        shortUrl,
    });
    res.json(newUrl);
};

const redirectUrlService = async (shortUrl) => {
    const urlEntry = await URL.findOne({ shortUrl });
    if (!urlEntry) return res.status(404).json({ message: "URL not found" });
    // Aggiorna il conteggio dei click
    urlEntry.clicks += 1;
    await urlEntry.save();
    // Ottieni info dall'IP (facoltativo)
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const geoData = await axios.get(`https://ipinfo.io/${ip}/json?token=YOUR_IPINFO_TOKEN`);
    const { city, country } = geoData.data;
    // Registra l'evento in analytics
    await Analytics.create({
        url: urlEntry._id,
        ip,
        location: `${city}, ${country}`,
        browser: req.headers["user-agent"],
        referrer: req.headers.referer || "Direct",
    });
    return urlEntry.originalUrl;
};

const getAnalyticsService = async (shortUrl) => {
    const urlEntry = await URL.findOne({ shortUrl }).populate("analytics");
    if (!urlEntry) return res.status(404).json({ message: "URL not found" });
    return urlEntry.analytics;
};

module.exports = { shortenUrlService, redirectUrlService, getAnalyticsService };
