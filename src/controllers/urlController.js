const {
    shortenUrlService,
    redirectUrlService,
    getAnalyticsService,
} = require("../helpers/urlHelper");

const shortenUrl = async (req, res) => {
    try {
        const { originalUrl, newUrl } = req.body;
        if (!originalUrl) {
            return res.status(400).json({ error: "Original URL is required" });
        }
        // if (!isValidUrl(originalUrl)) {
        //     return res.status(400).json({ error: "Invalid URL format" });
        // }
        const shortenedUrl = await shortenUrlService(originalUrl, newUrl);
        return res.status(201).json(shortenedUrl);
    } catch (error) {
        console.error("❌ Error in shortenUrl:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const redirectUrl = async (req, res) => {
    try {
        const { shortUrl } = req.body;
        if (!shortUrl) {
            return res.status(400).json({ error: "Short URL is required" });
        }
        const redirectUrl = await redirectUrlService(req, res, shortUrl);
        if (!redirectUrl) {
            return res.status(404).json({ error: "Short URL not found" });
        }
        return res.status(201).json(redirectUrl);
    } catch (error) {
        console.error("❌ Error in redirectUrl:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAnalytics = async (req, res) => {
    try {
        const { url } = req.params;
        if (!url) {
            return res.status(400).json({ error: "Short URL is required" });
        }
        const analyticsData = await getAnalyticsService(url);
        if (!analyticsData) {
            return res.status(404).json({ error: "No analytics found for this URL" });
        }
        return res.status(200).json(analyticsData);
    } catch (error) {
        console.error("❌ Error in getAnalytics:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { shortenUrl, redirectUrl, getAnalytics };
