import { Router } from "express";
import { addUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middlware.js";

const router = Router();

router.route("/add-user").post(
    addUser
)

// router.route("/update-user-details").post(
//     verifyJWT,
//     updateUserDetails
// )

// router.route("/cur-user").get(
//     verifyJWT,
//     curUser
// )

// router.route("/signin").post(
//     signin
// )

// router.route("/refresh-token").post(
//     refreshAccessToken
// )

// router.route("/logout").get(verifyJWT, logout)

// router.route("/verification").get(isUserLoggedIn);
export default router