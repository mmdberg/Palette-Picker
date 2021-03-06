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

app.get('/api/v1/palettes/:id', (request, response) => {
  const id = parseInt(request.params.id)
  database('palettes').where('project_id', id).select()
    .then(palettes => {
      if(palettes.length) {
        response.status(200).json(palettes)
      } else {
        response.status(404).json({
          error: 'Could not find palettes for project'
        })
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    }) 
})

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  if (!project.title) {
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

app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;

  if(!palette.title) {
    return response.status(422).send({
      error: 'No palette name provided'
    })
  } else {
    database('palettes').insert(palette, 'id')
      .then(palette => {
        response.status(200).json({ id: palette[0]})
      })
      .catch(error => {
        response.status(500).json({ error })
      })
  }
})

app.delete('/api/v1/palettes/:id', (request, response) => {
  database('palettes').where('id', request.params.id).del()
    .then(id => response.sendStatus(204))
    .catch(error => 
      response.status(500).json({ error }))
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`)
})

module.exports = {app, database};

