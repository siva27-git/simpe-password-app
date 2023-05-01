const Passwords = require('./models/Passwords');

const calculateMinSteps = async (req) => {

    try {
        const { password = "" } = req.body || {};

        if (password.length == 0) {
            return {
                status: "failure",
                message: "Input password in empty",
            };
        };

        const response = minStepsToMakePasswordStrong(password);
        const saveResponse = await saveInDb(password, response);

        if (saveResponse.status == "success") {
            return {
                status: "success",
                message: "Record Saved in DB !",
                data: {
                    password: password,
                    minSteps: response,
                }
            };
        } else {
            return {
                status: "failure",
                message: "Error while storing in DB",
            };
        }
    } catch (error) {
        console.log(`Error while calling API`, error.message, error);
        throw new Error(error);
    }
};

// minStepsToMakePasswordStrong takes password(string) as a parameter

const minStepsToMakePasswordStrong = (password) => {

    /* Initialize the required variables with the initial values as 0, "" and false respectively */

    let numOfSteps = 0;
    let hasLowerCase = false;
    let hasUpperCase = false;
    let hasDigit = false;
    let prevCharCode = "";
    let repeatingCharCodes = 0;
    let missingLength = 0;

    // Loop through each character in the password

    for (let i = 0; i < password.length; i++) {
        // Check if the current character is a lowercase, uppercase, or digit character with the help of charCode
        const currentCharCode = password.charCodeAt(i);

        if (currentCharCode >= 97 && currentCharCode <= 122) hasLowerCase = true;      // lowercase
        else if (currentCharCode >= 65 && currentCharCode <= 90) hasUpperCase = true;  // uppercase
        else if (currentCharCode >= 48 && currentCharCode <= 57) hasDigit = true;      // digit

        // Check if the current character is the same as the previous character
        if (currentCharCode == prevCharCode) {
            repeatingCharCodes++
        }
        else {
            repeatingCharCodes = 1
            prevCharCode = currentCharCode
        }

        // If there are three repeating characters in a row, increment the number of steps, need to check this
        if (repeatingCharCodes == 3) {
            numOfSteps++;
            repeatingCharCodes = 0
        }
    }

    //Increment the missing length if the password not having a digit or lowerCase or uppercase

    if (!hasDigit) missingLength++;
    if (!hasUpperCase) missingLength++;
    if (!hasLowerCase) missingLength++;

    if (password.length + missingLength < 6) {
        // If the length of the password plus the missing length is less than 6, calculate the additional missing characters required
        missingLength += 6 - (password.length + missingLength);
    }
    if (password.length + missingLength > 20) {
        // If the length of the password plus the missing length is greater than 20, calculate the excess characters that need to be removed
        missingLength += password.length + missingLength - 20;
    }
    // Add the missing length to the total number of steps
    numOfSteps = numOfSteps + missingLength;

    return numOfSteps;

};

// Saving the record in DB

const saveInDb = async (password, noOfSteps) => {
    try {
        const createResponse = await Passwords.create({ password, noOfSteps });
        console.log(`Record created successfully in DB ${JSON.stringify(createResponse)}`);

        return {
            status: "success",
            message: "Record saved in DB successfully",
        };
    } catch (error) {
        console.log(`Error while saving the response in DB ${error.message} `);
        return {
            status: "failure",
            message: "Error while saving the record in DB",
        };
    }
};

module.exports = {
    calculateMinSteps
};