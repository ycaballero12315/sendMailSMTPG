const dbEmail = require('../model/dbEmail');
const emailSend = require('./emailSender');

const sendMailsAuto = () =>{
  setInterval(async ()=>{
    try {
        const emails = await dbEmail.find({enviado: false}).lean().exec(); //Busca los documentos que no han sido enviados
        console.log(`Faltan por enviar ${emails.length} correos!`);
        const ids = emails.map((email)=> email._id); //Obtenemos los IDs de los documentos que se actualizarán

        await emailSend(emails.map((email)=> email.name),emails.map((email)=> email.email),emails.map((email)=> email.asunto), emails.map((email)=> email.text)).catch((err)=>{
            console.error('El correo no se envio correctamente! ', err)
        });
        
        await dbEmail.updateMany({ _id: { $in: ids } }, { enviado: true }).catch((err) => {
            console.log('No se pudo actualizar a enviado! ', err);
        });
        console.log(`Se enviaron ${emails.length} correos!` )
    } catch (err) {
        console.error('Error al enviar los correos:', err);
    }
  }, 7200000); //Enviar automaticamente cada dos horas.
};

module.exports = sendMailsAuto;