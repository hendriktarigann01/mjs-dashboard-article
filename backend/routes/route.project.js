const express = require("express");
const router = express.Router();
const controllerProject = require("../controllers/controller.project.js")

router.get("/get-project/", controllerProject.getAllProjects);
router.get("/get-project/:id", controllerProject.getProjectById);
router.post("/create-project/", controllerProject.createProject);
router.put("/update-project/:id", controllerProject.updateProjectById);
router.delete("/delete-project/:id", controllerProject.deleteProjectById);

module.exports = router;
