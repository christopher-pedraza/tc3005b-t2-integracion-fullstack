const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = require("express").Router();
const userModel = require("../models/user");

router.post("/login", async (request, response) => {
    const { username, password } = request.body;
    console.log("username: ", username);
    console.log("password", password);

    const user = await userModel.findOne({ username });
    console.log("user: ", user);
    const passwordCorrect =
        user === null
            ? false
            : await bcrypt.compare(password, user.passwordHash);
    console.log("passwordCorrect: ", passwordCorrect);

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: "invalid username or password",
        });
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    };
    console.log("userForToken: ", userForToken);

    const token = jwt.sign(userForToken, process.env.SECRET);
    console.log("token: ", token);

    console.log(
        "Response: " + user.username + " " + user.name + " " + user.rol
    );
    response.status(200).send({
        token,
        username: user.username,
        name: user.name,
        rol: user.rol,
    });
});

router.post("/signup", async (request, response) => {
    const { username, name, password, rol } = request.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new userModel({
        username,
        name,
        passwordHash,
        rol,
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser);
});

router.get("/", async (request, response) => {
    const users = await userModel.find({});
    response.json(users);
});

module.exports = router;
