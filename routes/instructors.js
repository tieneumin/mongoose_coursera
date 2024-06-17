const express = require("express");
const router = express.Router();

// instruction: import the instructor model
const Instructor = require("../models/instructor");
const Course = require("../models/course");

// instruction: GET /: List all instructors
router.get("/", async (req, res) => {
  try {
    res.status(200).send(await Instructor.find());
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// instruction: setup GET /:id: Get a specific instructor  by its _id
router.get("/:id", async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (instructor) {
      res.status(200).send(instructor);
    } else {
      res.status(404).send({ message: "Instructor not found." });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// instruction: setup POST /: Add a new instructor
router.post("/", async (req, res) => {
  try {
    const { name, qualification, profile, coursesTaught } = req.body;
    const instructor = new Instructor({
      name,
      qualification,
      profile,
      coursesTaught,
    });
    res.status(200).send(await instructor.save());
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// instruction: setup PUT /:id: Update a instructor by its _id
router.put("/:id", async (req, res) => {
  try {
    const { name, qualification, profile, coursesTaught } = req.body;
    const { id } = req.params;
    const instructor = await Instructor.findById(id);
    if (instructor) {
      res
        .status(200)
        .send(
          await Instructor.findByIdAndUpdate(
            id,
            { name, qualification, profile, coursesTaught },
            { new: true }
          )
        );
    } else {
      res.status(404).send({ message: "Instructor not found." });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// instruction: setup DELETE /:id: Delete a instructor by its _id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const instructor = await Instructor.findById(id);
    if (instructor) {
      const course = await Course.find({ instructor: id });
      if (course.length > 0) {
        res.status(403).send({ message: "Instructor is currently in use." });
      } else {
        await Instructor.findByIdAndDelete(id);
        res.status(200).send(`Instructor ${id} successfully deleted.`);
      }
    } else {
      res.status(404).send({ message: "Instructor not found." });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// instruction: export the router
module.exports = router;
