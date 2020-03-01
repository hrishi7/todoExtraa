const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    taskNo:String,
    taskTitle: String,
    taskDesc:String,
    taskStatus: String,
    date:{type :String, default: Date.now}
}) ;

module.exports = mongoose.model('Task', TaskSchema);