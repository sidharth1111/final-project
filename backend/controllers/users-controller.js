const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");

let dummy_users = [
    {
        id: "u1",
        name: "sidharth",
        email: "sid@test.com",
        password: "tester",
    },
    {
        id: 2,
        name: "user2",
        email: "random user",
        password: "qwertt",
    },
];

const getUsers = (req, res, next) => {
    res.json({ users: dummy_users });
};

const signup = (req, res, next) => {
    const { name, email, password } = req.body;
    const createdUser = {
        id: uuidv4(),
        name,
        email,
        password,
    };
    const emailAlreadyPresent = dummy_users.find(
        (user) => user.email === email
    );
    if (emailAlreadyPresent) {
        throw new HttpError("Couldn't create user, user already exits.", 401);
    }
    dummy_users.push(createdUser);
    res.status(200).json({ user: createdUser });
    console.log(dummy_users);
};

const login = (req, res, next) => {
    const { email, password } = req.body;
    console.log(email, password);
    if (email && password) {
        const IdentifiedUser = dummy_users.find((user) => user.email === email);
        console.log(IdentifiedUser);
        if (!IdentifiedUser || IdentifiedUser.password !== password) {
            throw new HttpError("Couldnt identify user, creds wrong", 401);
        }
        res.json({ message: "Logged in." });
    }
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
