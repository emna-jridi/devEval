const express = require('express')
const router = express.Router()
const { login, register, getAllUsers, getUserByEmail, UpdateUser, deleteUser } = require('../Controller/UserController')
const {  createAgent, 
    getAllAgent,
     updateAgent,
     deleteAgent, } = require('../Controller/agentController')

//authentication route 
router.route('/users').get(getAllUsers)
router.route('/login').post(login)
router.route('/register').post(register)
router.route('/users/:email').get(getUserByEmail).patch(UpdateUser).delete(deleteUser)

router.route('/Agent').post(createAgent)
router.route('/Agents').get(getAllAgent)
router.route('/agent/:email').patch(updateAgent).delete(deleteAgent)

module.exports = router 