const mongoose = require('mongoose')
const conectarDB = async () => {
    try{
      await mongoose.connect(`mongodb://localhost:27017/chalannet`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      })  
      console.log("Base de datos conectada")
    } catch(e){
        console.log(e)
        process.exit(1) // DETENER LA APP
    }
}
module.exports = conectarDB