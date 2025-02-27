const URL = require("../models/URL");
const Analytics = require("../models/Analytics");
const axios = require("axios");
const useragent = require("useragent");

const shortenUrlService = async (originalUrl, newUrl) => {
    if (newUrl) {
        const existingUrl = await URL.findOne({ shortUrl: newUrl });
        if (existingUrl) {
            throw new Error("Custom short URL already exists");
        }
    }
    const newUrlEntry = await URL.create({
        originalUrl: originalUrl,
        shortUrl: newUrl,
    });
    return newUrlEntry;
};

const redirectUrlService = async (req, res, shortUrl) => {
    const urlEntry = await URL.findOne({ shortUrl });
    if (!urlEntry) return res.status(404).json({ message: "URL not found" });
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const geoData = await axios.get(`https://ipinfo.io/${ip}/json?token=f33966465fc938`);
    const { city, country } = geoData.data || { city: "Unknown", country: "Unknown" };
    const agent = useragent.parse(req.headers["user-agent"]);
    const browser = agent.family;
    const os = agent.os.family;
    const deviceType = agent.device.family || "Unknown";
    await Analytics.create({
        url: urlEntry._id,
        ip,
        location: `${city}, ${country}`,
        browser,
        os,
        deviceType,
        referrer: req.headers.referer || "Direct",
        userAgent: req.headers["user-agent"],
    });
    urlEntry.clicks += 1;
    await urlEntry.save();
    return urlEntry.originalUrl;
};

const getAnalyticsService = async (url) => {
    const urlAnalytics = await Analytics.findOne({ url }).populate("analytics");
    if (!urlEntry) return res.status(404).json({ message: "URL not found" });
    return urlAnalytics;
};

module.exports = { shortenUrlService, redirectUrlService, getAnalyticsService };
