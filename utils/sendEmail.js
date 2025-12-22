const nodemailer = require('nodemailer')


  exports.sendEmail = async (to,subject,text ) =>{
    try {
        const transporter =   nodemailer.createTransport({
            host:'smtp.mail.ru',
            port:  465,
            auth:{
                user: 'pal5555@mail.ru',
                pass: '9FepBBe0AUK3NRczVesE'
            }
        })
    
        await transporter.sendMail({
            from: 'pal5555@mail.ru',
            to,
            subject,
            text,
        })
    } catch (error) {
        console.log(error)
        
    }
   
}