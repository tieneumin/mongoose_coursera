const express = require("express");
const router = express.Router();

// instruction: import the course model
const Course = require("../models/course");

/* 
    instruction: 
    - setup GET /: List all courses (utilize populate() to bring in instructor details)
*/
router.get("/", async (req, res) => {
  try {
    res.status(200).send(await Course.find().populate("instructor"));
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// instruction: setup GET /:id: Retrieve details of a specific course by its _id (use populate() for instructor details)
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("instructor");
    if (course) {
      res.status(200).send(course);
    } else {
      res.status(404).send({ message: "Course not found." });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// instruction: setup POST /: Add a new course
router.post("/", async (req, res) => {
  try {
    const {
      title,
      instructor,
      startDate,
      endDate,
      subject,
      description,
      enrollmentCount,
    } = req.body;
    const course = new Course({
      title,
      instructor,
      startDate,
      endDate,
      subject,
      description,
      enrollmentCount,
    });
    res.status(200).send(await course.save());
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// instruction: setup PUT /:id: Modify details of a course by its _id
router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      instructor,
      startDate,
      endDate,
      subject,
      description,
      enrollmentCount,
    } = req.body;
    const { id } = req.params;
    const course = await Course.findById(id);
    if (course) {
      res.status(200).send(
        await Course.findByIdAndUpdate(
          id,
          {
            title,
            instructor,
            startDate,
            endDate,
            subject,
            description,
            enrollmentCount,
          },
          { new: true }
        )
      );
    } else {
      res.status(404).send({ message: "Course not found." });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// instruction: setup DELETE /:id: Remove a course by its `_id`
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (course) {
      await Course.findByIdAndDelete(id);
      res.status(200).send(`Course ${id} successfully deleted.`);
    } else {
      res.status(404).send({ message: "Course not found." });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// instruction: export the router
module.exports = router;
