# Nodejs Expressjs Modbus API Project Structure

## Getting started

This is a basic API skeleton written in JavaScript ES2015.
It uses modbus serial to connect to Arduino Uno programmed with OpenPLC, read
the coils and send the web API response in JSON

## Features

- JWT Tokens is available to implement, make requests with a token after login with `Authorization`
  header with value `Bearer yourToken` where `yourToken` will be returned in Login response.
- Pre-defined response structures with proper status codes.
- Light-weight project.
- Linting with [Eslint](https://eslint.org/).

## Software Requirements

- Node.js **8+**
- modbus-serial
- serialport

## How to install

### Using Git (recommended)

1.  Clone the project from github. Change "myproject" to your project name.

### Using manual download ZIP

1.  Download repository
2.  Uncompress to your desired directory

### Install npm dependencies after installing (Git or manual download)

```bash
cd myproject
npm install
```

## How to run

### Running API server locally

```bash
npm run dev
```

You will know server is running by checking the output of the command `npm run dev`

## Bugs or improvements

Every project needs improvements, Feel free to report any bugs or improvements. Pull requests are always welcome.

## License

This project is open-sourced software licensed under the MIT License. See the LICENSE file for more information.
