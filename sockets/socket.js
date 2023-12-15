const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index')
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');

// Mensajes de de Sockets
io.on('connection', client => {

    console.log('Cliente conectado');

    // Cliente con JsonWebToken
    const [ valido, uid ] = comprobarJWT( client.handshake.headers['x-token'] )

    if ( !valido ) { return client.disconnect(); }

    // Cliente autenticado, lo pone online
    usuarioConectado( uid );

    // Ingresar al usuario en una sala en particular
    // sala global, client.id, 65770a0f12f50fc4dae69ee6
    client.join( uid );

    //Escuchar del cliente el mensaje-personal
    client.on('mensaje-personal', async (payload) => {
        // console.log(payload);
        await grabarMensaje( payload )
        io.to( payload.para ).emit('mensaje-personal', payload);
    })


    client.on('disconnect', () => {
        usuarioDesconectado(uid);
    });

    // client.on('mensaje', ( payload ) => {
    //     console.log('Mensaje!!!', payload);
    //     io.emit( 'mensaje', { admin: 'Nuevo mensaje'});
    // })
});