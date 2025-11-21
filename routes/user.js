const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const {
  saveRedirectUrl,
  isLoggedIn,
  logoutWhenReverify,
  checkIfUserLoggedIn,
} = require("../middleware.js");
const { validateUser } = require("../middleware.js");
const userController = require("../controllers/users.js");

router
  .route("/signup")
  .get(userController.renderSignUp)
  .post(validateUser, userController.signup);

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );
// --- In your user/auth routes file ---

router.get("/verify-email", userController.verifyEmail);
router.get("/logout", userController.logout);
router.get("/email", userController.renderEmailPage);
router.get(
  "/resend-verification-link",
  isLoggedIn,
  userController.renderReVerifyEmailPage
);
router.post(
  "/resend-verification-link",
  isLoggedIn,
  userController.resendEmail
);

router
  .route("/forgot-password")
  .get(userController.renderForgotPasswordPage)
  .post(userController.submitForgotPassForm);

router
  .route("/reset-password")
  .get(userController.renderResetForgotForm)
  .post(userController.resetPassword);

module.exports = router;
