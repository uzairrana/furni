const { authJwt } = require("../middlewares/authJwt");

const { addProject, asigningProject } =
    require("../controllers").project;


module.exports = (router) => {
    router.route("/addProject").post(addProject);
    router.route("/asigningProject").post(asigningProject);
};
