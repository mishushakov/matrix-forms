require('dotenv').config()
const express = require('express')
const formidable = require('formidable')
const sdk = require('matrix-js-sdk')
const app = express()
const fs = require('fs')

const port = 3000

const client = sdk.createClient({
  baseUrl: process.env.HOMESERVER,
  accessToken: process.env.ACCESS_TOKEN,
})

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

app.post('/', (req, res) => {
  const roomId = req.params.form || process.env.DEFAULT_ROOM
  const form = formidable({})
  form.parse(req, (error, fields, files) => {
    if (error) return res.status(400).send(error)

    const message = {
      body: `New form submission ${req.hostname}\n`,
      formatted_body: '<h4>New form submission</h4>',
      format: 'org.matrix.custom.html',
      msgtype: 'm.text'
    }

    Object.keys(fields).forEach((field) => {
      message.body += `${capitalize(field)}: ${fields[field]}\n`
      message.formatted_body += `${capitalize(field)}: <b>${fields[field]}</b><br />`
    })

    client.sendEvent(roomId, 'm.room.message', message)
    .then(console.log)
    .catch(error => res.status(400).send(error.message))

    Object.values(files).forEach((file) => {
      client.uploadContent(fs.createReadStream(file.filepath))
      .then((url) => {
        const content = {
          msgtype: 'm.file',
          body: file.originalFilename,
          url: JSON.parse(url).content_uri
        }

        client.sendMessage(roomId, content)
        .catch(error => res.status(500).send(error.message))
      })
      .catch(error => res.status(500).send(error.message))
    })

    res.sendStatus(200)
  })
})

app.listen(process.env.PORT, () => {
  console.log(`Listening at http://localhost:${port}`)
})
