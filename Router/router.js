const express = require('express')
const router = express.Router()
const { login, register, } = require("../Controller/AuthenticationController")
const { getAllUsers, getUserByEmail, UpdateUser, deleteUser } = require('../Controller/UserController')
const { createAgent, getAllAgent, updateAgent, deleteAgent, } = require('../Controller/AgentController')
const { createEmployee, deleteEmployee, getAllEmployee, updateEmpolyee } = require('../Controller/EmployeeController')
const { authorizationAdmin, authorizationRTA,
    authorizationRPA, } = require("../Service/AuthService")

const { createProject, getAllProject, updateProject, deleteProject, assignToEmployee } = require('../Controller/ProjectController')
const {createRelease,getAllReleases,updateRelease,deleteRelease,assignToProject}= require('../Controller/ReleaseController')

//authentication route 
router.route('/users').get(getAllUsers)
router.route('/login').post(login)
router.route('/register').post(register)
router.route('/users/:email').get(getUserByEmail).put(UpdateUser).delete(deleteUser)

//Agent Crud 
router.route('/Agent').post(authorizationAdmin, createAgent)
router.route('/Agents').get(authorizationAdmin, getAllAgent)
router.route('/agent/:email').put(authorizationAdmin, updateAgent).delete(authorizationAdmin, deleteAgent)


//employee Crud
router.route('/employee').post(authorizationAdmin, createEmployee)
router.route('/employees').get(getAllEmployee)
router.route('/employee/:email').put(authorizationAdmin, updateEmpolyee)
    .delete(authorizationAdmin, deleteEmployee)


//Project Crud 
router.route('/project').post(authorizationAdmin, createProject)
router.route('/projects').get(getAllProject)
router.route('/project/:label').put(authorizationAdmin, updateProject)
    .delete(authorizationAdmin, deleteProject)
    .post(authorizationAdmin, assignToEmployee)




    //Release Crud 

router.route('/release').post(createRelease)
router.route('/releases').get(getAllReleases)
router.route('/release/:name').put(updateRelease)
.delete(deleteRelease)
.post(assignToProject)

module.exports = router 