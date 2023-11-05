const courseParerService = require('../services/parser.service')

class parserController{
    async callback(req, res, next){
        try{
            let first_name, second_name, email, street, apartment_number, city, phone_number, post_code

            first_name = req.body['form_fileds[name]']
            second_name = req.body['form_fields[field_7e04b27]']
            email = req.body['form_fields[email]']
            street = req.body['form_fields[field_2ee6ead]']
            apartment_number = req.body['form_fields[field_6fd6def]']
            city = req.body['form_fields[field_89dc639]']
            phone_number = req.body['form_fields[field_3dceee2]']
            phone_number = phone_number.split(' ')[1]
            console.log({phone_number})
            phone_number = phone_number.split('-')[0] + phone_number.split('-')[1] + phone_number.split('-')[2]
            post_code = req.body['form_fields[field_4ec2f55]']


            console.log({first_name, second_name, email, street, apartment_number, city, phone_number, post_code})

            if(first_name && second_name && email && street && apartment_number && city && phone_number && post_code){
                console.log("OK")
                const data = await courseParerService.callback(first_name, second_name, email, street, apartment_number, city, phone_number, post_code)
                return res.json(data)
            }

        }catch (e) {
            next(e)
        }
    }
}

module.exports = new parserController()