const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");

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

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;

    const place = dummy_places.find(p => {
        return p.id === placeId;
    });

    if (!place) {
        throw new HttpError("Coudn't find a place for the provided place id.", 500);
    }

    res.json({place: place});
};


const getPlaceByUserId = (req, res, next) => {
    const uid = req.params.uid;
    const place = dummy_places.find(p => {
        return uid === p.creator;
    });
    console.log("places=", dummy_places)

    if (!place) {
        return next(new HttpError("Couldn't find a place for the provided user id.", 404));
    }
    res.json({place})
}; 

const createPlace = (req, res, next) => {
    const { title, description, coordinates, address, creator } = req.body;
    const createdPlace = {
        id: uuidv4(),
        title,
        description,
        location: coordinates,
        address,
        creator
    };
    dummy_places.push(createdPlace);
    res.status(201).json({ place: createdPlace });
}

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;