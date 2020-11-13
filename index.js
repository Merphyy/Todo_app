const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const Task = require('./task');

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//connect to db
const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://merphy123:merphy123@devconnector.r4mnr.mongodb.net/test?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    );
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    //exit process with failure
    process.exit(1);
  }
};
connectDB();
//cors
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/', (req, res, next) => {
  res.send('Hello');
});

//add the task
app.post('/todo', async (req, res) => {
  try {
    console.log('============:' + req.body.name);
    const newTask = new Task({
      name: req.body.name,
      task: req.body.task,
      completed: req.body.completed,
    });
    console.log(newTask);
    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    req.status(500).send('Server error');
  }
});

//delete the task
app.delete('/todo/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'task not found' });
    await task.remove();
    res.json({ msg: 'task removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId')
      return res.status(404).json({ msg: 'Post not found' });
    req.status(500).send('Server error');
  }
});

app.listen(5000, () => {
  console.log('Connected');
});
