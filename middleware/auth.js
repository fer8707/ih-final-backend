const jwt = require("jsonwebtoken")
module.exports = async(req, res, next) => {
    // RECIBIR EL TOKEN DEL FRONT (INSERTADO EN EL HEADER CON LOCALSTORAGE)
    const token = req.header('x-auth-token')
    console.log(token)
    // REVISAR SI NO HAY TOKEN
    if (!token){
        return res.status(400).json({
            msg: "no hay token"
        })
    }
    // SI SÍ HAY TOKEN VALIDAR EL TOKEN
    try{
        const verificacionCifrado = await jwt.verify(token, process.env.SECRETA)

        req.usuario = verificacionCifrado.usuario
        next()
        
    }
    catch(e){
        res.status(400).json({
            msg: "hubo una falla"
        })

    }
}