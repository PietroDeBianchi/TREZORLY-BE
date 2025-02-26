const URL = require("../models/URL");
const Analytics = require("../models/Analytics");
const { nanoid } = require("nanoid"); // Per generare short URL
const axios = require("axios");

const shortenUrl = async (req, res) => {
    try {
        const { originalUrl } = req.body;
        const shortUrl = nanoid(8); // Genera un ID univoco di 8 caratteri

        const newUrl = await URL.create({
            originalUrl,
            shortUrl,
        });

        res.json(newUrl);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const redirectUrl = async (req, res) => {
    try {
        const { shortUrl } = req.params;
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

        // Reindirizza all'URL originale
        res.redirect(urlEntry.originalUrl);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAnalytics = async (req, res) => {
    try {
        const { shortUrl } = req.params;
        const urlEntry = await URL.findOne({ shortUrl }).populate("analytics");

        if (!urlEntry) return res.status(404).json({ message: "URL not found" });

        res.json(urlEntry.analytics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { shortenUrl, redirectUrl, getAnalytics };
