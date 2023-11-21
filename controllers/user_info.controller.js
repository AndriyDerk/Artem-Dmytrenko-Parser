const userInfoService = require('../services/user_info.service')

class userInfoController{
    async statistic(req, res, next){
        try{
            const users_info = await userInfoService.statistic()

            return res.json(users_info)
        }catch (e) {
            next(e)
        }
    }
}

module.exports = new userInfoController()


