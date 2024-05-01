const fs = require("fs")
const dotenv = require("dotenv")
dotenv.config()
const dirname = process.cwd()
const folder = process.env.LOG_FOLDER

const Log = (type, file, message, data) => {
    try {
        const date = new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata'})
        const path = `${dirname}/${folder}/${file}`
        if (process.env.LOGGING) {
            fs.promises.access(path, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, err => {
                logForCreation(err)
            })
                .then(() => {
                    appendData(path, '\n' + date +": "+type + ":" + message + " " + data)
                    appendData(path, '\n' + date +": "+type + ":" + message + " " + data)
                })
                .catch(() => {
                    create(path, '\n' + date +": "+type + ":" + message + " " + data)
                })
        }

    } catch (e) {
        logForCreation(err)
    }
}

const create = (fileName, data) => {
    fs.writeFile(fileName, data, function (err) {
        if (err) {
            logForCreation(JSON.stringify(err))
            return;
        }
        console.log("Log created successfully")
    })
}

const appendData = (fileName, data) => {
    fs.appendFile(fileName, data, function (err) {
        if (err) {
            logForCreation(err)
            return;
        }
        console.log("Log created successfully")
    })
}

const logForCreation = (data) => {
    console.log(folder)
    fs.writeFile(`${dirname}/${folder}/filecreation`, data, function (err) {
        console.log("Log creation error " + JSON.stringify(err));
    })
}

module.exports = Log