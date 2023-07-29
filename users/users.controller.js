const express = require('express');
const router = express.Router();
const Joi = require('joi');

const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const userService = require('./user.service');
// const frontendSrc = require('frontend/src');

// routes
router.post('/Login', loginSchema, login);
// router.post('/Login', authorizedUser(), loginSchema, login);
router.post('/Register', registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/Main', authorize());
// router.get('/Current', authorize(), getCurrent);
// router.get('/:id', authorize(), getById);
// router.put('/:id', authorize(), updateSchema, update);
// router.delete('/:id', authorize(), _delete);

module.exports = router;

function loginSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function login(req, res, next) {
    userService.authenticate(req.body)
        .then(user => 
            res.json(user)
            )
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        phone: Joi.string().min(10).max(10).required(),
        username: Joi.string().required(),
        password: Joi.string().min(6).required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    reqValue = req.body
    const {username, email, phone, password} = reqValue
    param = {username, email, phone, password, role: 'unauthorized'}
    userService.create(param)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.user);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().empty(''),
        phone: Joi.string().min(10).max(10).empty(''),
        username: Joi.string().empty(''),
        password: Joi.string().min(6).empty('')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}

