const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(express.static("dist"));

//middleware
app.use(express.json());
app.use(cors());

// Middleware de registro de solicitudes
const requestLogger = (request, response, next) => {
    console.log("Method:", request.method);
    console.log("Path:  ", request.path);
    console.log("Body:  ", request.body);
    console.log("---");
    next();
};
app.use(requestLogger);

// Middleware de manejo de errores
const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    }

    next(error);
};
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
