const express = require('express')
const router = express.Router()
const { login, register, getAllUsers, getUserByEmail, UpdateUser, deleteUser } = require('../Controller/UserController')
const {  createAgent,  getAllAgent, updateAgent, deleteAgent, } = require('../Controller/AgentController')
const {createEmployee,deleteEmployee,getAllEmployee, updateEmpolyee}= require('../Controller/EmployeeController')
const { 
    authorizationAdmin,}= require('../Service/AuthService')

//authentication route 
router.route('/users').get(getAllUsers)
router.route('/login').post(login)
router.route('/register').post(register)
router.route('/users/:email').get(getUserByEmail).put(UpdateUser).delete(deleteUser)

//Agent Crud 
router.route('/Agent').post(authorizationAdmin,createAgent)
router.route('/Agents').get(authorizationAdmin,getAllAgent)
router.route('/agent/:email').put(authorizationAdmin,updateAgent).delete(authorizationAdmin,deleteAgent)


//employee Crud
router.route('/employee').post(authorizationAdmin,createEmployee)
router.route('/employees').get(authorizationAdmin,getAllEmployee)
router.route('/employee/:email').put(authorizationAdmin,updateEmpolyee).delete(authorizationAdmin,deleteEmployee)

module.exports = router 