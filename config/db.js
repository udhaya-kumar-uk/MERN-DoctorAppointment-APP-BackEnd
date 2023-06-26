const mongoos = require('mongoose')
const colore = require('colors')

const connectdb = async () => {
    try {
        await mongoos.connect(process.env.MONGODB_URL)
        console.log('mongodb connected'.bgGreen.white)
    } catch (error) {
        console.log(`mongodb server issue ${error}`.bgRed.white)
    }
}

module.exports = connectdb