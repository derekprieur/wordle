const PORT = 8000
const axios = require("axios").default
const express = require("express")
const cors = require("cors")
require('dotenv').config()
const app = express()

app.use(cors())

app.get('/word', (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://random-words5.p.rapidapi.com/getMultipleRandom',
        params: { count: '5', wordLength: '5' },
        headers: {
            'X-RapidAPI-Key': '7be5a9bcc5msh2b74fb5480cd279p17f9aajsn79b848f2237d',
            'X-RapidAPI-Host': process.env.RAPID_API_KEY
        }
    }

    axios.request(options).then(function (response) {
        console.log(response.data)
        res.json(response.data[0])
    }).catch(function (error) {
        console.error(error)
    })
})

app.get('/check', (req, res) => {
    const word = req.query.word

    const options = {
        method: 'GET',
        url: 'https://twinword-word-graph-dictionary.p.rapidapi.com/association/',
        params: { entry: word },
        headers: {
            'X-RapidAPI-Key': '7be5a9bcc5msh2b74fb5480cd279p17f9aajsn79b848f2237d',
            'X-RapidAPI-Host': process.env.RAPID_API_KEY
        }
    }

    axios.request(options).then(function (response) {
        console.log(response.data);
    }).catch(function (error) {
        console.error(error);
    });
})

app.listen(PORT, () => console.log('Server running on port ' + PORT))

