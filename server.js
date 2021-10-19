const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express();

app.use(express.static(path.join(__dirname, 'public')))

const port = process.argv.PORT || 3000

app.get('/', (req, res)=>{ 
    res.sendFile(__dirname, '/index.js')
})

app.listen(port, (req, res)=>{
    console.log(`Server is listening on port ${port}`);
})