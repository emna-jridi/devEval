const express = require('express')
const router = express.Router()
const { authorizationAdmin, authorizationRTA,
    authorizationRPA, } = require("../Service/AuthService")
const { createProject, getAllProject, updateProject, deleteProject, assignToEmployee } = require('../Controller/ProjectController')
const {createRelease,getAllReleases,updateRelease,deleteRelease,assignToProject}= require('../Controller/ReleaseController')
const {createDemand,getAllDemand,updateDemand,deleteDemand,assignToRelease}= require('../Controller/DemandController')

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


//demand crud 
router.route('/demand').post(createDemand)
router.route('/demands').get(getAllDemand)
router.route('/demand/:title').put(updateDemand).delete(deleteDemand).post(assignToRelease)


module.exports = router 