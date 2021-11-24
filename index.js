require('dotenv').config()
const express = require('express')
const formidable = require('formidable')
const sdk = require('matrix-js-sdk')
const app = express()
const fs = require('fs')

const client = sdk.createClient({
  baseUrl: process.env.HOMESERVER,
  accessToken: process.env.ACCESS_TOKEN,
})

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

app.post('/', (req, res) => {
  const roomId = req.params.form || process.env.DEFAULT_ROOM
  const form = formidable({})
  form.parse(req, async (error, fields, files) => {
    if (error) return res.status(400).send(error)

    const message = {
      body: `New submission\n`,
      formatted_body: '<h4>New submission</h4>',
      format: 'org.matrix.custom.html',
      msgtype: 'm.text'
    }

    Object.keys(fields).forEach((field) => {
      message.body += `${capitalize(field)}: ${fields[field]}\n`
      message.formatted_body += `${capitalize(field)}: <b>${fields[field]}</b><br />`
    })

    try {
      await client.sendEvent(roomId, 'm.room.message', message)
    } catch (e) {
      return res.status(e.httpStatus).send(e.data.error)
    }

    Object.values(files).forEach(async (file) => {
      try {
        const url = await client.uploadContent(fs.createReadStream(file.filepath))
        const content = {
          msgtype: 'm.file',
          body: file.originalFilename,
          url: JSON.parse(url).content_uri
        }

        await client.sendMessage(roomId, content)
      } catch (e) {
        return res.status(e.httpStatus).send(e.data.error)
      }
    })

    await res.sendStatus(200)
  })
})

app.listen(process.env.PORT, () => {
  console.log(`Listening at http://localhost:${process.env.PORT}`)
})
