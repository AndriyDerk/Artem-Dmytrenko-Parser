const courseParerService = require('../services/parser.service')

class parserController{
    async callback(req, res, next){
        try{
            const {first_name, second_name, email, street, apartment_number, city, phone_number, post_code} = req.body

            if(first_name, second_name, email, street, apartment_number, city, phone_number, post_code){
                await courseParerService.callback(first_name, second_name, email, street, apartment_number, city, phone_number, post_code)
            }

        }catch (e) {
            next(e)
        }
    }
}

module.exports = new parserController()