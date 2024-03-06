const express = require('express')
const router = express.Router()
const { authorizationAdmin,  } = require("../Service/AuthService")
const { createAgent, getAllAgent, updateAgent, deleteAgent, } = require('../Controller/AgentController')
router.route('/Agent').post(authorizationAdmin, createAgent)
router.route('/Agents').get(authorizationAdmin, getAllAgent)
router.route('/agent/:email').put(authorizationAdmin, updateAgent).delete(authorizationAdmin, deleteAgent)


module.exports = router 