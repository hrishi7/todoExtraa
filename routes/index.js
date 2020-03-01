const express = require('express');
const router = express.Router();

const Task = require('../models/Task');

// @route GET /api/
// @desc redirecting shortUrl to original url
// @access Public
router.get('/',async (req, res)=>{
    try {
        const tasks = await Task.find().sort({date :-1})
        if(tasks){
            return res.json(tasks);
        }else{
            return res.json({message:'Task not found', variant:'error'})
        }
    } catch (error) {
        console.error(error);
        res.json({message:'server error', variant:'error'});
    }
})

// @route POST /api/addTask
// @desc adding a new Task
// @access Public

router.post('/addTask', async (req, res)=>{
    try {
        if (req.body.taskTitle !== ''){
            let taskNo = 0;
            let prevTask = await Task.find().sort({date :-1})
            if(!prevTask.length){
                taskNo += 1;
            }else{
                taskNo = Number(prevTask[0].taskNo) + 1;
            }
            new Task({
                taskNo:taskNo,
                taskTitle:req.body.taskTitle,
                taskDesc: req.body.taskDesc,
                taskStatus: req.body.taskStatus
            })
            .save()
            .then(() => res.json({message:'Task Created', variant:'success'}))
            .catch(error=> res.json({message:'some error in backend!', variant:'error'}))
        }
        else{
            res.json({message:'Title is required', variant:'error'});
        }
    } catch (error) {
        res.json({message:'server error', variant:'error'});
    }
});

// @route UPDATE /api/updateTask/:id
// @desc updating a Task
// @access Public
router.post('/updateTask/:id', async (req, res)=>{
    try {
        if(req.body.taskTitle !== ''){
            let taskObj = {
                taskTitle: req.body.taskTitle,
                taskDesc: req.body.taskDesc,
                taskStatus: req.body.taskStatus
            }
            Task.findOneAndUpdate({ _id: req.params.id},{ $set: taskObj }, { new: true })
            .then(()=>{ res.json({message:'Task Updated', variant:'success'})})
            .catch(error=> res.json({message:'some error in backend!', variant:'error'}))

        }
        else{
            res.json({message:'Title is required', variant:'error'});
        }
    }
    catch (error) {
        res.json({message:'server error', variant:'error'});
    }
})

// @route UPDATE /api/updateTaskStatus/:id
// @desc updating a Task status
// @access Public
router.post('/updateTaskStatus/:id', async (req, res)=>{
    try {
        if(req.body.taskTitle !== ''){
            Task.findOneAndUpdate({ _id: req.params.id},{ $set: {taskStatus: req.body.taskStatus } }, { new: true })
            .then(()=>{ res.json({message:'Task status Updated', variant:'success'})})
            .catch(error=> res.json({message:'some error in backend!', variant:'error'}))
        }
        else{
            res.json({message:'Title is required', variant:'error'});
        }
    }
    catch (error) {
        res.json({message:'server error', variant:'error'});
    }
})

// @route UPDATE /api/getTask/:id
// @desc updating a Task
// @access Public
router.get('/getTask/:id', async(req, res)=>{
    try {
        Task.findOne({_id: req.params.id})
        .then((result)=>res.json(result))
        .catch(error=> res.json({message:'some error in backend!', variant:'error'}))
    }
    catch (error) {
        res.json({message:'server error', variant:'error'});
    }
})


// @route DELETE /api/deleteTask/:id
// @desc deleting a Task
// @access Public
router.delete('/deleteTask/:id', async(req, res)=>{
    try {
        Task.findOneAndDelete({ _id: req.params.id})
            .then(()=>res.json({message:'Deleted successfully', variant:'success'}))
            .catch(error=> res.json({message:'some error in backend!', variant:'error'}))
    } catch (error) {
        res.json({message:'server error', variant:'error'});
    }
})

module.exports = router;