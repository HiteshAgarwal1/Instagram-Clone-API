const express = require('express')
const mongoose = require('mongoose')
const { MONGOURI } = require('./keys')

const app = express();
const PORT = 5000;

require('./models/user')
app.use(express.json())
app.use(require('./routes/auth'))


mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
}, (err) => {
    if(err)
        console.log("Error: ", err);
    else
    console.log("Connected Successfully to Mongoose! ");
})
mongoose.set("debug", true);


app.listen(PORT, () => {
    console.log("Server is listing to PORT: ", PORT);
})