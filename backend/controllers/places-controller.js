const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");

let dummy_places = [
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
    },
    {
        id: 'p2',
        title: "BSE",
        description: "Moneyyy",
        location: {
            lat: 31,
            lng: -34
        },
        address: "Mumbai",
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


const getPlacesByUserId = (req, res, next) => {
    const uid = req.params.uid;
    const places = dummy_places.filter(p => uid === p.creator);

    if (!places || places.length === 0) {
        return next(new HttpError("Couldn't find places for the provided user id.", 404));
    }
    res.json({places})
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
};

const updatePlaceById = (req, res, next) => {
    const { title, description } = req.body;
    const placeId = req.params.pid;

    const updatedPlace = { ...dummy_places.find(place => placeId === place.id)};
    const placeIndex = dummy_places.findIndex(place => place.id === placeId);

    updatedPlace.title = title;
    updatedPlace.description = description;

    dummy_places[placeIndex] = updatedPlace;

    res.status(200).json({place: updatedPlace});
};

const deletePlace = (req, res, next) => {
    const pid = req.params.pid;
    dummy_places = dummy_places.filter(p => p.id !== pid)
    res.status(200).json({message: 'Deleted place.'})
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlace = deletePlace;