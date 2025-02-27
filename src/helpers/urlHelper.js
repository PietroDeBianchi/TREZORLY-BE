const URL = require("../models/URL");
const Analytics = require("../models/Analytics");
const axios = require("axios");
const useragent = require("useragent");

/**
 * Service to create a shortened URL.
 * - If a custom short URL (`newUrl`) is provided, it checks for duplicates.
 * - If no custom URL is provided, it generates a new one.
 * - Saves the URL mapping in the database.
 *
 * @param {string} originalUrl - The original long URL.
 * @param {string} [newUrl] - (Optional) Custom short URL.
 * @returns {Promise<Object>} - The newly created URL entry.
 * @throws {Error} - If the custom short URL already exists.
 */
const shortenUrlService = async (originalUrl, newUrl) => {
    if (newUrl) {
        // Check if the custom short URL already exists
        const existingUrl = await URL.findOne({ shortUrl: newUrl });
        if (existingUrl) {
            throw new Error("Custom short URL already exists");
        }
    }

    // Create and store the new URL mapping
    const newUrlEntry = await URL.create({
        originalUrl: originalUrl,
        shortUrl: newUrl,
    });

    return newUrlEntry;
};

/**
 * Service to handle redirection from a short URL.
 * - Finds the original URL based on the short URL.
 * - Tracks analytics: IP address, location, browser, OS, device type, and referrer.
 * - Increments the click count for the short URL.
 *
 * @param {Object} req - The request object from Express.
 * @param {Object} res - The response object from Express.
 * @param {string} shortUrl - The short URL identifier.
 * @returns {Promise<string>} - The original URL to redirect to.
 */
const redirectUrlService = async (req, res, shortUrl) => {
    // Find the URL entry in the database
    const urlEntry = await URL.findOne({ shortUrl });
    if (!urlEntry) return res.status(404).json({ message: "URL not found" });

    // Extract client IP address
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // Fetch geolocation data based on IP address (requires API key)
    const geoData = await axios.get(`https://ipinfo.io/${ip}/json?token=YOUR_IPINFO_TOKEN`);
    const { city, country } = geoData.data || { city: "Unknown", country: "Unknown" };

    // Parse user-agent to get browser and OS information
    const agent = useragent.parse(req.headers["user-agent"]);
    const browser = agent.family;
    const os = agent.os.family;
    const deviceType = agent.device.family || "Unknown";

    // Log analytics data in the database
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

    // Increment click count for the short URL
    urlEntry.clicks += 1;
    await urlEntry.save();

    return urlEntry.originalUrl;
};

/**
 * Service to retrieve analytics data for a specific URL.
 * - Fetches analytics related to a given URL.
 *
 * @param {string} url - The short URL identifier.
 * @returns {Promise<Object>} - The analytics data for the given URL.
 * @throws {Error} - If the URL is not found.
 */
const getAnalyticsService = async (url) => {
    // Find the analytics data for the given URL
    const urlAnalytics = await Analytics.findOne({ url }).populate("analytics");

    if (!urlAnalytics) {
        throw new Error("URL not found");
    }

    return urlAnalytics;
};

module.exports = { shortenUrlService, redirectUrlService, getAnalyticsService };
