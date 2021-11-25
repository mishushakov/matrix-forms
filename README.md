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

## Features

- Server-side, no additional JavaScript
- Rich formatting
- Many forms on same instance
- File uploads
- Templates
- CORS

Consider suppporting me if you want to see new features

## Prerequisite

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

`return` - Return URL (for the template)

`redirect` - Redirect address (on success)

### Templates

`templates/success.handlebars` - Success template
