const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('port', process.env.PORT || 3000);

// app.use((request, response, next) => {
//   response.header('Access-Control-Allow-Origin', '*')
//   next()
// })

app.locals.title = 'Palette Picker'

app.get('/', (request, response) => {

})

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then((projects) => {
      response.status(200).json(projects)
    })
    .catch((error) => {
      response.status(500).json({error})
    })
})

app.get('/api/v1/palette/:id', (request, response) => {

})

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;
  console.log(project)

  if (!project) {
    return response.status(422).send({
      error: 'No project name provided'
    })
  } else {
    database('projects').insert(project, 'id')
      .then(project => {
        response.status(200).json({ id: project[0] })
      })
      .catch(error => {
        response.status(500).json({ error })
      })
  } 
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`)
})



