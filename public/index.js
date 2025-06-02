const { ifError } = require('assert')
const express = require('express')
const fs = require('fs')
const app = express()
const port = 80
app.use(express.urlencoded({extended: true}))
app.use(express.static('pub'))


// Route to handle form submission 
app.post('/submit-form', (req, res) => { 
    fs.appendFile('contacts.json', '\n' + JSON.stringify(req.body), (err)=>{
            if (err) {
                console.log('error writing to the file');                
            }else{
                console.log("data appended");
                
            }
    })
    console.log('Form data received:', req.body); 
    res.redirect('/') });

app.post('/api/subscribe', (req,res)=>{
    fs.appendFile('subscribers.json', JSON.stringify(req.body), (err)=>{
        if (err) {
           console.log('error subscribing');           
        } else {
            console.log('subscriber listed');            
        }
    })
    res.redirect('/') 
})



app.post('/api/membership-form', (req,res)=>{
    fs.appendFile('new-members.json', JSON.stringify(req.body), (err)=>{
        if (err) {
           console.log('error signing');           
        } else {
            console.log('member listed');            
        }
    })
    res.redirect('/') 
})


 // Start the server
  app.listen(port, () => {   console.log(`Server running at http://localhost:${port}`); });

