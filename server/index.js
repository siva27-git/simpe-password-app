require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const apiRouter = require('./src/routes');

const { PORT, MONGO_DB_URI } = process.env;

mongoose.connect(MONGO_DB_URI);
const db = mongoose.connection;

db.on("error", (error) => {
    logger.info("Error while connecting to DB", error);
});

db.once("open", async () => {
    console.log("Connected to DB");

    const app = express();

    app.use(express.json());
    app.use(cors());

    app.use('/api', apiRouter);

    app.use((req, res) => {
        res.status(404).json({ status: "failure", message: "Path not found, Please provide proper route" });
    });

    app.listen(PORT, () => {
        console.log(`Server started at port ${PORT}`);
    });

});