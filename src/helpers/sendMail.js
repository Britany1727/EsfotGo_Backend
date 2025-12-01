import sendMail from "../config/nodemailer.js"



const sendMailToRegister = (userMail, token) => {

    return sendMail(
        userMail,
        "Bienvenido a EsfotGo",
        `
            <h1>Confirma tu cuenta</h1>
            <p>Hola, haz clic en el siguiente enlace para confirmar tu cuenta:</p>
            <a href="${process.env.URL_FRONTEND}confirmar/${token}">
            Confirmar cuenta
            </a>
            <hr>
            <footer>El equipo de EsfotGo te da la más cordial bienvenida.</footer>
        `
    )
}

const sendMailToRecoveryPassword = (userMail, token) => {

    return sendMail(      

        userMail,
        "Restablece tu contraseña",
        `
            <h1>Restablece tu contraseña</h1>
            <p>Hola, haz clic en el siguiente enlace para restablecer tu contraseña:</p>
            <a href="${process.env.URL_FRONTEND}recuperarpassword/${token}">

            Restablecer contraseña
            </a>
            <hr>                    
            <footer>El equipo de EsfotGo te da la más cordial bienvenida.</footer>
        `
    )
}


export {
    sendMailToRegister,
    sendMailToRecoveryPassword
}