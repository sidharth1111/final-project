const express = require('express');
const router = express.Router();

const dummy_places = [
    {
        id: 'p1',
        title: "esb",
        description: "tall",
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
        const error = new Error("Coudn't find place for place id.");
        error.code = 404;
        throw error;
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
        const error = new Error("Couldn't find place for user id.");
        error.code = 404;
        return next(error);
    }
    res.json({place})
});
module.exports = router;