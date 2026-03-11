const express = require("express");
const router = express.Router();
const controllerProject = require("../controllers/controller.project.js");
const { uploadProjectImage } = require("../lib/cloudinary.js");
const authMiddleware = require("../middleware/middleware.auth.js");

router.get("/get-project", controllerProject.getAllProjects);
router.get("/get-project/:id", controllerProject.getProjectById);
router.post("/create-project", authMiddleware, uploadProjectImage, controllerProject.createProject);
router.put("/update-project/:id", authMiddleware, uploadProjectImage, controllerProject.updateProjectById);
router.patch("/publish/:id", authMiddleware, controllerProject.publishProject);
router.patch("/view/:id", controllerProject.trackView); // public, no auth
router.get("/:slug", controllerProject.getProjectBySlug); // public, no auth
router.delete("/delete-project/:id", authMiddleware, controllerProject.deleteProjectById);

module.exports = router;