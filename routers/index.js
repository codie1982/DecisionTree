const singup = require("./auth")
const job = require("./job")
const createRoutes = (app) => {
    app.use(`/api/job`, job)
    app.use(`/api/auth`, singup)
}
module.exports = createRoutes