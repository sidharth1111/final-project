const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");

let dummy_places = [
    {
        id: "p1",
        title: "Taj Mahal",
        description: "Beautiful",
        location: {
            lat: 34,
            lng: -84,
        },
        address: 20,
        creator: "u1",
    },
    {
        id: "p2",
        title: "BSE",
        description: "Moneyyy",
        location: {
            lat: 31,
            lng: -34,
        },
        address: "Mumbai",
        creator: "u1",
    },
];

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId).exec(); // exec returns a promise
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find a place.",
            500
        );
        return next(error);
    }

    if (!place) {
        const error = new HttpError(
            "Coudn't find a place for the provided place id.",
            404
        );
        return next(error);
    }

    res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
    const uid = req.params.uid;

    let places;
    try {
        places = await Place.find({ creator: uid });
    } catch (err) {
        const error = new HttpError(
            "Fetching places failed, please try again later.",
            500
        );
        return next(error);
    }

    if (!places || places.length === 0) {
        return next(
            new HttpError("Couldn't find places for the provided user id.", 404)
        );
    }
    res.json({
        places: places.map((place) => place.toObject({ getters: true })),
    });
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }
    const { title, description, address, creator } = req.body;

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }
    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        creator,
    });

    dummy_places.push(createdPlace);
    try {
        await createdPlace.save();
    } catch (err) {
        const error = new HttpError(
            "Creating place failed, please try again.",
            500
        );
        return next(error);
    }
    res.status(201).json({ place: createdPlace });
};

const updatePlaceById = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError(
            "Invalid inputs passed, please check your data.",
            422
        );
    }
    const { title, description } = req.body;
    const placeId = req.params.pid;

    const updatedPlace = {
        ...dummy_places.find((place) => placeId === place.id),
    };
    const placeIndex = dummy_places.findIndex((place) => place.id === placeId);

    updatedPlace.title = title;
    updatedPlace.description = description;

    dummy_places[placeIndex] = updatedPlace;

    res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
    const pid = req.params.pid;
    if (
        !dummy_places.find((p) => {
            return pid === p.id;
        })
    ) {
        throw new HttpError("Couldn't find a place for that id.", 404);
    }
    6;
    dummy_places = dummy_places.filter((p) => p.id !== pid);
    res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlace = deletePlace;
