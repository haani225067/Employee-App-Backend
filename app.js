// Task1: initiate app and run server at 3000
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));
app.use(express.static(path.join(__dirname, 'dist', 'Frontend')));
// Task2: create mongoDB connection 
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas successfully');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB Atlas:', error.message);
    });

// Define Employee Schema & Model
const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    }
});

const Employee = mongoose.model('Employee', employeeSchema);

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below







//TODO: get data from db  using api '/api/employeelist'
app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee list', error: error.message });
    }
});




//TODO: get single data from db  using api '/api/employeelist/:id'
app.get('/api/employeelist/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee', error: error.message });
    }
});






//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.post('/api/employeelist', async (req, res) => {
    try {
        const { name, location, position, salary } = req.body;
        const newEmployee = new Employee({
            name,
            location,
            position,
            salary
        });
        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch (error) {
        res.status(500).json({ message: 'Error adding employee', error: error.message });
    }
});






//TODO: delete a employee data from db by using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully', employee: deletedEmployee });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error: error.message });
    }
});





//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.put('/api/employeelist', async (req, res) => {
    try {
        const id = req.body._id || req.body.id;
        let updatedEmployee;
        if (id) {
            updatedEmployee = await Employee.findByIdAndUpdate(
                id,
                {
                    name: req.body.name,
                    location: req.body.location,
                    position: req.body.position,
                    salary: req.body.salary
                },
                { new: true }
            );
        } else {
            updatedEmployee = await Employee.findOneAndUpdate(
                { name: req.body.name },
                {
                    location: req.body.location,
                    position: req.body.position,
                    salary: req.body.salary
                },
                { new: true }
            );
        }

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee', error: error.message });
    }
});

// Also support updating by /:id parameter
app.put('/api/employeelist/:id', async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                location: req.body.location,
                position: req.body.position,
                salary: req.body.salary
            },
            { new: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee', error: error.message });
    }
});


//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
