const express = require('express');
const HttpError = require("../models/http-error")

const router = express.Router();

const dummy_places = [
    {
        id: 'p1',
        title: "Taj Mahal",
        description: "Beautiful",
        location: {
            lat: 34,
            lng: -84
        },
        address: 20,
        creator: 'u1'
    }
]

router.get("/:pid", (req, res, next) => {
    const placeId = req.params.pid;

    const place = dummy_places.find(p => {
        return p.id === placeId;
    });

    if (!place) {
        throw new HttpError("Coudn't find a place for the provided place id.", 500);
    }

    res.json({place: place});
});

router.get("/user/:uid", (req, res, next) => {
    const uid = req.params.uid;
    console.log(uid)
    const place = dummy_places.find(p => {
        return uid === p.creator;
    });

    if (!place) {
        return next(new HttpError("Couldn't find a place for the provided user id.", 404));
    }
    res.json({place})
});
module.exports = router;