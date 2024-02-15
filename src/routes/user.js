const { getSingleUser } = require("../controllers/user");
const { authJwt } = require("../middlewares/authJwt");

const { addUser, getAllUsers, updateUser, deleteUser, getAllMangers,
  getAllVendors,
  getAllClient,
  getAllWorker, } =
  require("../controllers").user;
const { adminLogin,
  forgetPasswordAdmin,
  resetPasswordAdmin, } =
  require("../controllers").admin;

module.exports = (router) => {
  router.route("/login").post(adminLogin);
  router.route("/forgetPassword").post(forgetPasswordAdmin);
  router.route("/resetPassword").post(resetPasswordAdmin);
  router.route("/admin/addUser").post(authJwt, addUser);
  router.route("/admin/getAllUsers").get(authJwt, getAllUsers);
  router.route("/admin/updateUser/:id").put(authJwt, updateUser);
  router.route("/admin/deleteUser/:id").delete(authJwt, deleteUser);
  router.route("/admin/singleUser/:id").get(authJwt, getSingleUser);




  router.route("/admin/getAllVendors").get(authJwt, getAllVendors);
  router.route("/admin/getAllMangers").get(authJwt, getAllMangers);
  router.route("/admin/getAllClient").get(authJwt, getAllClient);
  router.route("/admin/getAllWorker").get(authJwt, getAllWorker);

};
