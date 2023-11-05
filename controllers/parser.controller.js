const courseParerService = require('../services/parser.service')

class parserController{
    async callback(req, res, next){
        try{
            const {first_name, second_name, email, street, apartment_number, city, phone_number, post_code} = req.body
            console.log(req, req.body, {first_name, second_name, email, street, apartment_number, city, phone_number, post_code})

            if(first_name, second_name, email, street, apartment_number, city, phone_number, post_code){
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