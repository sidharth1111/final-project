const axion = require("axios");
const HttpError = require("../models/http-error");
const API_KEY = "sedfhgvcxfghjvcfhgyuhjvg";

async function getCoordsForAddress(address) {
    // dummy data
    // {
    //     lat: 34,
    //     lng: -84,
    // };
    const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
        )}&key=${API_KEY}`
    );

    const data = response.data;

    if (!data || data.status === "ZERO_RESULTS") {
        const error = new HttpError(
            "Couldn't find location for the specified address",
            422
        );
        throw error;
    }

    const coordinates = data.results[0].geometry.location;
    return coordinates;
}

module.exports = getCoordsForAddress;
