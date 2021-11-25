# Matrix Forms

Connect your forms to [Matrix](https://matrix.org)

**Example**

```html
<form method="POST" action="http://localhost:3000" enctype="multipart/form-data">
  <div>
    <label for="name">Name</label>
    <input type="text" name="name" required>
  </div>

  <div>
    <label for="link">Link</label>
    <input type="text" name="link" required>
  </div>

  <div>
    <label for="file">File</label>
    <input type="file" name="file" required>
  </div>

  <input type="submit">
</form>
```

**In Matrix**

![Screenshot](https://i.imgur.com/fSZuwNr.png)

[Demo](https://mishushakov.github.io/matrix-forms)

## Features

- Server-side, no additional JavaScript
- Rich formatting
- Many forms on same instance
- File uploads
- Templates
- CORS
- Access with bots

Consider sponsoring me if you want to see new features

## Prerequisites

1. Create new account
2. In Element, go to "All settings" > "Help & About" and copy the "Access Token" from the "Advanced" section
3. For each form, create a new (unencrypted) room and then go to "Room Settings" > "Advanced" and copy the "Internal room ID"
4. Follow the installation proccess below

## Installation

### Using Docker

```sh
docker run ghcr.io/mishushakov/matrix-forms:latest
```

See the [configuration](#configuration) options below

### Bare-metal

1. Clone and enter the repository

```sh
git clone https://github.com/mishushakov/matrix-forms && cd matrix-forms
```

2. Install the dependencies

```sh
npm i
```

3. [Configure](#configuration) using environment variables

4. Start the server

```
npm start
```

## Configuration

### Environment Variables

`PORT` - Port to listen to

`HOMESERVER` - Matrix Homeserver

`ACCESS_TOKEN` - User access token

`DEFAULT_ROOM` - Default room for submissions if no room is specified in query params

`CORS` - CORS Origin

### Query Params

`to` - Matrix room to submit the form

`return` - Return URL (rendered in template)

`redirect` - Redirect to `return` URL (Boolean)

### Templates

`templates/message.handlebars` - Message template

`templates/success.handlebars` - Success template

## Access forms with bots

The messages should contain `matrix.forms` field to help you parse submission contents with bots

```json
"matrix.forms": {
  "fields": {
    "link": "gfd",
    "name": "gfd"
  },
  "files": [
    {
      "content_uri": "mxc://matrix.org/gMFeqNWiVdMnBfmxTyxDgeMP",
      "name": "recording-3.ogg",
      "size": 12527
    }
  ]
}
```
