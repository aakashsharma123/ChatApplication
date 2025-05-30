import mongoose from 'mongoose'

const conncetDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL)
        console.log("db has been connected successfully")
    } catch (error) {
        console.log("error" , error)
    }
}

export default conncetDB