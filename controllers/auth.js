const { response } = require("express")
const bcrypt = require('bcryptjs');

const { validationResult } = require("express-validator")
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");


const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const existeEmail = await Usuario.findOne({email}); 
        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        // Generar mi JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            usuario,
            token 
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const loginUsuario = async (req, res = response) => {
    try {

        const { email, password } = req.body;

        const usuarioDB = await Usuario.findOne({email})

        if (!usuarioDB) {
            return res.status(400).json({
                ok: true,
                msg: 'El email no encontrado'
            });
        }

        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: true,
                msg: 'Datos incorrectos'
            });    
        } 

        const token = await generarJWT( usuarioDB.id );

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const renewToken = async (req, res = response) => {

    // const uid uid del usuario
    const uid = req.uid;

    // generar un nuevo JWT
    const token = await generarJWT(uid);

    // Obtener el usuario por el UID
    const usuarioDB = await Usuario.findById( uid );

        if (!usuarioDB) {
            return res.status(400).json({
                ok: true,
                msg: 'uid no encontrado'
            });
        }


    res.json({
        ok: true,
        usuario: usuarioDB,
        token
    });


}


module.exports = {
    crearUsuario,
    loginUsuario,
    renewToken
}