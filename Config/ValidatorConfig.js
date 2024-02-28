const Joi = require('joi');
const ROLES = require('../Config/ConstConfig')


const userValidationSchema = Joi.object({
    _id: Joi.object({
        $oid: Joi.string().length(24).hex(), // Ensure valid MongoDB ObjectID
    }),
    fullName: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'tn'] } })
        .required(),

    password: Joi.string()
        .required()
        //.pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:\'"|,.<>?]{3,30}$'))

    ,

    userType: Joi.string()
        .valid(ROLES.RA, ROLES.RPA, ROLES.RTA)
        .required()

}).options({ abortEarly: false, allowUnknown: true });

const EmpolyeeValidationSchema = Joi.object({
    fullName: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'tn'] } })
        .required(),

    position: Joi.string()
        .required(),

    rank: Joi.number()
        .required(),
    entryDate: Joi.date()
        .iso()//iso => format 'YYYY-MM-DD'
        .required(),


}).options({ abortEarly: false, allowUnknown: true });//execlure  les champs supplementaires de la validation



module.exports = { userValidationSchema: userValidationSchema, EmpolyeeValidationSchema: EmpolyeeValidationSchema }