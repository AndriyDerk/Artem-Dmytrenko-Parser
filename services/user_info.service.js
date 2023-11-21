const User_info = require('../models/user_info.model')

class userInfoService{
    async statistic(){
        try{
            const users_info = await User_info.find().sort({created_at: -1})
            let list = []

            for(let key in users_info){
                let registered = 'NO'
                let updated_at = new Date(users_info[key].created_at).toString().slice(4, 24)
                if(users_info[key].registered){
                    registered = 'YES'
                }
                list.push({
                    email: users_info[key].email,
                    registered,
                    updated_at
                })
            }

            return list
        }catch (e) {
            console.log(e)
        }

    }

}
module.exports = new userInfoService()
