import express from "express"
import { SubTask } from "../models/subTask.js";
import { Task } from "../models/task.js";
import { isAuthenticated } from "../middlewares/auth.js";
import ErrorHandler from "../middlewares/error.js";
// import { subtract } from "lodash";
const router = express.Router();

const calculateTaskStatus = async (taskId) => {
    const subtasks = await SubTask.find({ task_id: taskId });
    const allSubtasksCompleted = subtasks.every((subtask) => subtask.status === 1);
    if (allSubtasksCompleted) {
        return "DONE";
    }
    else {
        const hasCompletedSubtask = subtasks.some((subtask) => subtask.status === 1);
        if (hasCompletedSubtask) {
            return 'IN_PROGRESS';
        }
        else {
            return "TODO";
        }
    }
};

router.post("/", isAuthenticated, async (req, res, next) => {
    try {
        const { task_id } = req.body;

        // Check if task_id is provided
        const task = await Task.findOne({ _id: task_id });

        if (!task_id || !task) {
            return next(new ErrorHandler('Invalid Task ID', 400));
        }

        // Create the subtask
        const subtask = await SubTask.create({ task_id });

        // Respond with the created subtask
        res.status(201).json({
            message: 'Subtask successfully created',
        });
    } catch (error) {
        // Handle errors and respond accordingly
        next(new ErrorHandler('Internal Server Error', 500));
    }
});


router.get("/:id", isAuthenticated, async (req, res,next) => {
    try {
        const subTaskId = req.params.id;

        // Attempt to find the subtask by ID
        const subTask = await SubTask.findById(subTaskId);

        if (!subTask) {
            // If subtask is not found, throw an error
            return next(new ErrorHandler('Invalid subtask Id', 400));
        }

        // If subtask is found, respond with the subtask
        res.status(200).json(subTask);
    } catch (error) {
        // Handle errors using the error middleware
        next(error);
    }
});


router.delete("/:id", isAuthenticated, async (req, res,next) => {
    const subTaskId = req.params.id;
    try {
        const subTask = await SubTask.findById(subTaskId);

        if (!subTask) {
            return next(new ErrorHandler("Invalid Id",404));
        }

        // Soft delete by updating deleted_at
        // subTask.deleted_at = new Date().toLocaleDateString('en-IN');
        // await subTask.save();
        // console.log();
        await subTask.deleteOne();

        res.status(200).json({ message: 'Subtask deleted successfully' });
    } catch (error) {
        // Handle other errors using the error middleware
        next(error);
    }
});


router.put("/:id", isAuthenticated, async (req, res,next) => {
    const subTaskId = req.params.id;
    const { status } = req.body;

    try {
        // Find the SubTask by its id
        const subTask = await SubTask.findById(subTaskId);

        // If SubTask not found, return a 404 Not Found response
        if (!subTask) {
            return next(new ErrorHandler("Invalid Id",400))
        }

        // Update SubTask status and set updated_at
        subTask.status = status;
        subTask.updated_at = new Date().toLocaleDateString('en-IN');
        await subTask.save();

        // Calculate new Task status based on SubTask updates
        const newTaskStatus = await calculateTaskStatus(subTask.task_id);

        // Update the corresponding Task with the new status and updated_at
        const updatedTask = await Task.findByIdAndUpdate(
            subTask.task_id,
            { status: newTaskStatus, updated_at: new Date().toLocaleDateString('en-IN') },
            { new: true }
        );

        // Respond with the updated SubTask
        res.status(200).json(subTask);
    } catch (error) {
        // Handle other errors using the error middleware
        next(error);
    }
});



router.get("/task/:id", isAuthenticated, async (req, res,next) => {
    const taskId = req.params.id;
    const subtasks = await SubTask.find({ task_id: taskId });
    res.status(200).json(subtasks);
})

export default router