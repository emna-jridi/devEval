const Employee = require('../Model/EmployeeModel')
const { StatusCodes } = require('http-status-codes');


// Function to create a new employee
const createEmployee = async (req, res) => {
    try {

        const foundEmployee = await Employee.findOne({ email: req.body.email })
        // Checking if an employee with the provided email already exists
        if (foundEmployee) {
            return res.status(StatusCodes.UNAUTHORIZED)
                .json({ message: `${foundEmployee.fullName} already exists.` });
        }
        // Creating a new employee instance with data from the request body 
        const employee = new Employee({
            fullName: req.body.fullName,
            email: req.body.email,
            position: req.body.position,
            rank: req.body.rank,
            entryDate: req.body.entryDate,
        })
        // Checking if all required properties are provided
        if (!employee.fullName || !employee.email || !employee.position || !employee.rank || !employee.entryDate) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Please provide all employee information!" });
        }
        // Saving the new employee to the database
        await employee.save()
        // Sending a success response
        res
            .status(StatusCodes.ACCEPTED)
            .send({ message: `${employee.fullName} was registered successfully!` });

        // Sending an internal server error response if an error occurs
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
}


// Function to retrieve all employees
const getAllEmployee = async (req, res) => {
    try {
        // Finding all employees in the database
        const employees = await Employee.find({})
        // Mapping the employee data to a simpler format
        const data = employees.map((employee) => {
            return {
                fullName: employee.fullName,
                email: employee.email,
                position: employee.position,
                rank: employee.rank,
                entryDate: employee.entryDate,
                createdAt: employee.createdAt,
                updatedAt: employee.updatedAt
            }
        })
        res.status(StatusCodes.ACCEPTED).json({ employees: data });

    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
}

// Function to update an employee
const  updateEmpolyee = async (req, res) => {
    try {

        // Checking if all required properties are provided in the request body
        if (!req.body.email || !req.body.fullName || !req.body.position || !req.body.rank || !req.body.entryDate) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Please provide all employee information!" });
        }
        // Creating an update object with data from the request body
        const update = {
            email: req.body.email,
            fullName: req.body.fullName,
            position: req.body.position,
            rank: req.body.rank,
            entryDate: req.body.entryDate,
        }
        // Finding and updating the employee with the provided email
        const updatedEmployee = await Employee.findOneAndUpdate({ email: req.params.email },
            update,
            { new: true }
        )
        if (!updatedEmployee) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Employee not found." });
        }
        // Sending a success response with the updated employee data
        res.status(StatusCodes.OK).json({ updatedEmployee });

    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
}


// Function to delete an employee
const deleteEmployee = async (req, res) => {
    try {
 // Checking if the employee email is provided
        const employeEmail = req.params.email
        if (!employeEmail) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Missing employee email." });
        }
 // Finding and deleting the employee with the provided email
        const employee = await Employee.findOneAndDelete({
            email: employeEmail
        })

        if (!employee) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Employee not found." });
        }
        res.status(StatusCodes.OK).json({ message: "Employee was deleted successfully!" });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
}

module.exports = {
    createEmployee,
    getAllEmployee,
    updateEmpolyee,
    deleteEmployee,
}






