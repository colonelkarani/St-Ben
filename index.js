import express from "express";
const app = express();

app.use(express.static('public/main'));
app.set('view engine', 'ejs')

app.get('/', (req,res)=>
{
    res.render('index')
})

app.listen(5000, ()=>{
    console.log(`liistening on port 5000`);
})