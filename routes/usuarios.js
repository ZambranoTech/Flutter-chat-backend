/*
    path: api/usuarios
*/


const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-json');
const { getUsuarios } = require('../controllers/usuarios');

const router = Router();

router.get('/', validarJWT, getUsuarios);

module.exports = router;