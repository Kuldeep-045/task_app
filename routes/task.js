import express from "express"
import { Task } from "../models/task.js";
const router = express.Router();
import { isAuthenticated } from "../middlewares/auth.js";
import { User } from "../models/user.js";
import ErrorHandler from "../middlewares/error.js";
import { SubTask } from "../models/subTask.js";

router.post("/", isAuthenticated, async (req, res, next) => {
    try {
        const { title, description, priority } = req.body;

        // Calculate due date based on priority
        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + priority);
        const formattedDueDate = dueDate.toLocaleDateString('en-IN');

        // Create a new task
        const task = await Task.create({
            title,
            description,
            due_date: formattedDueDate,
            user: req.user._id,
        });

        // Return a response with the created task and a message
        res.status(201).json({
            message: "Task successfully created",
        });
    } catch (error) {
        // Handle errors and pass to error middleware
        next(new ErrorHandler("Internal Server Error", 500));
    }
});


router.get("/", isAuthenticated, async (req, res,next) => {
    try {
        const user = req.user._id;
        const tasks = await Task.find({ user,deleted_at: null });
        // const tasks = await Task.find({ user });

        // Return a response with tasks and a message
        res.status(200).json(
            tasks,
        );
    } catch (error) {
        // Handle errors and pass to error middleware
        next(new ErrorHandler("Internal Server Error", 500));
    }
});

router.get("/:id", isAuthenticated, async (req, res,next) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId);

        if (!task) {
            return next((new ErrorHandler("Task not found", 404)))
        }

        // Return a response with the task and a message
        res.status(200).json(
            task,
        );
    } catch (error) {
        // Handle errors and pass to error middleware
        next(new ErrorHandler("Internal Server Error", 500));
    }
});


router.delete("/:id", isAuthenticated, async (req, res,next) => {
    const taskId = req.params.id;

    try {
        // const task = await Task.findById(taskId);
        const task = await Task.findById(taskId);

        // console.log(task);
        if (!task) {
            return next((new ErrorHandler("Task not found", 404)))
        }

        // Update the task's deleted_at property
        // task.deleted_at = new Date().toLocaleDateString('en-IN');
        // await task.save();
        const subTask= await SubTask.find({task_id:task._id})
        task.deleteOne()
        const subTaskIdsToDelete = subTask.map(task => task._id);

        // Assuming you have the task model available
        await SubTask.deleteMany({ _id: { $in: subTaskIdsToDelete } });


        

        // Respond with the updated task
        res.status(200).json({
            message: 'Task successfully deleted',
        });
    } catch (error) {
        // Handle errors and respond accordingly
        next((new ErrorHandler("'Internal Server Error'", 500)))
    }
});


export default router