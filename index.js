require('dotenv').config()
const express = require('express')
const formidableMiddleware = require('express-formidable-v2')
const { create } = require('express-handlebars')
const cors = require('cors')
const sdk = require('matrix-js-sdk')
const fs = require('fs')

const app = express()
app.use(formidableMiddleware())
app.use(cors({origin: process.env.CORS || '*'}))

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)
const hbs = create({
  helpers: {capitalize}
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', './templates')

const client = sdk.createClient({
  baseUrl: process.env.HOMESERVER,
  accessToken: process.env.ACCESS_TOKEN,
})

app.post('/', async (req, res) => {
  const roomId = req.query.to || process.env.DEFAULT_ROOM
  if (!req.fields || !req.files) return res.sendStatus(400)

  const message = {
    body: `New submission\n`,
    formatted_body: '<h4>New submission</h4>',
    format: 'org.matrix.custom.html',
    msgtype: 'm.text'
  }

  Object.keys(req.fields).forEach((field) => {
    message.body += `${capitalize(field)}: ${req.fields[field]}\n`
    message.formatted_body += `${capitalize(field)}: <b>${req.fields[field]}</b><br />`
  })

  try {
    await client.sendEvent(roomId, 'm.room.message', message)
  } catch (e) {
    return res.status(e.httpStatus).send(e.data.error)
  }

  Object.values(req.files).forEach(async (file) => {
    try {
      const url = await client.uploadContent(fs.createReadStream(file.path))
      const content = {
        msgtype: 'm.file',
        body: file.name,
        url: JSON.parse(url).content_uri
      }
      await client.sendMessage(roomId, content)
    } catch (e) {
      return res.status(e.httpStatus).send(e.data.error)
    }
  })

  if (req.query.redirect) return res.redirect(req.query.redirect)
  await res.render('success', {layout: false, data: {
    fields: req.fields,
    files: Object.values(req.files),
    return: req.query.return
  }})
})

app.listen(process.env.PORT, () => {
  console.log(`Listening at http://localhost:${process.env.PORT}`)
})
