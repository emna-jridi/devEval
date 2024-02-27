const express = require('express')
const router = express.Router()
const { login, register, getAllUsers, getUserByEmail, UpdateUser, deleteUser } = require('../Controller/UserController')
const {  createAgent,  getAllAgent, updateAgent, deleteAgent, } = require('../Controller/AgentController')
const {createEmployee,deleteEmployee,getAllEmployee, updateEmpolyee}= require('../Controller/EmployeeController')


//authentication route 
router.route('/users').get(getAllUsers)
router.route('/login').post(login)
router.route('/register').post(register)
router.route('/users/:email').get(getUserByEmail).put(UpdateUser).delete(deleteUser)
//Agent Crud 
router.route('/Agent').post(createAgent)
router.route('/Agents').get(getAllAgent)
router.route('/agent/:email').put(updateAgent).delete(deleteAgent)


//employee Crud
router.route('/employee').post(createEmployee)
router.route('/employees').get(getAllEmployee)
router.route('/employee/:email').put(updateEmpolyee).delete(deleteEmployee)

module.exports = router 