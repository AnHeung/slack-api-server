require('dotenv-flow').config({
    node_env: process.env.NODE_ENV || 'dev',
    silent: true
});

const {apiPath} = require('./appConstants');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const auth = require('./middleware/auth')

const swaggerDefinition = {
  info: { // API informations (required)
    title: 'Kuma Slack Server', // Title (required)
    version: '1.0.0', // Version (required)
    description: 'Kuma Slack Server 정의' // Description (optional)
  },
  host: process.env.SLACK_SERVER_URL, // Host (optional)
  basePath: '/' // Base path (optional)
};

// Options for the swagger docs
const options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  apis: apiPath
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 4504

if (process.env.NODE_ENV === "prod") {
    app.use(morgan("combined"));
} else {
    // development
    app.use(morgan("dev"));
}
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/slack',auth, require('./routes/slacks'))

app.listen(port, () => console.log(`Server listening on port ${port}`))