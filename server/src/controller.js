const { calculateMinSteps } = require('./services');

const processPassword = async (req, res) => {
    try {
        const response = await calculateMinSteps(req);

        if (response.status == "success") {
            console.log(`API success`);
            return res.status(200).json(response);
        } else {
            console.log(`API failure`);
            return res.status(400).json(response);
        }
    } catch (error) {
        console.log(`Error while calling the API`, error.message, error);
        return res.status(400).json({
            status: "failure",
            message: "Error while calling the API",
        });
    }
};

module.exports = {
    processPassword
};