const db= require('../db/index')

const schema = new db.Schema({
    first_name: {
        type: String,
        required: true
    },
    second_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    apartment_number: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    post_code: {
        type: String,
        required: true
    },
    registered: {
        type: Boolean,
        required: true
    },
    created_at: {
        type: Number,
        default: () => new Date().getTime()
    }
})

module.exports = db.model('Course_winner_payout', schema)
