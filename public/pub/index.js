const express = require('express')
const app = express()
const port = 3030
app.use(express.urlencoded({extended: true}))
app.use(express.static('pub'))


// Route to handle form submission 
app.post('/submit-form', (req, res) => { 
	console.log('Form data received:', req.body); 
	res.send('Form submitted successfully!'); });
 // Start the server
  app.listen(port, () => {   console.log(`Server running at http://localhost:${port}`); });

