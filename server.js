const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

//set port number to 3000 (unless otherwise specified)
app.set('port', process.env.PORT || 3000);

//set title of page
app.locals.title = 'Palette Picker'

//create client side page that implicitly calls static page
app.get('/', (request, response) => {
})

//get all projects from database
//name endpoint url
app.get('/api/v1/projects', (request, response) => {
  //select the projects table
  database('projects').select()
  //return a response object with status 200
    .then((projects) => {
      response.status(200).json(projects)
    })
    //if unsuccessful, return error object with status 500
    .catch((error) => {
      response.status(500).json({error})
    })
})

//get all palettes from database for specific project
//name endpoint url
app.get('/api/v1/palettes/:id', (request, response) => {
  //assign id from request url to variable id
  const id = parseInt(request.params.id)

  //select palettes that have foreign key that matches identified project
  database('palettes').where('project_id', id).select()
    .then(palettes => {
      //check if there are palettes for that project
      if(palettes.length) {
        //if there are, respond with the palettes
        response.status(200).json(palettes)
      } else {
        //if there aren't, respond with error
        response.status(404).json({
          error: 'Could not find palettes for project'
        })
      }
    })
    //if unsuccessful, return error object with status 500
    .catch(error => {
      response.status(500).json({ error })
    }) 
})

//Add new project to database
//name endpoint url
app.post('/api/v1/projects', (request, response) => {
  //assign request body object to variable project
  const project = request.body;

  //check if there is a title property on the request body object
  if (!project.title) {
    //if there isnt, return an error
    return response.status(422).send({
      error: 'No project name provided'
    })
  } else {
    //if there is, insert a new project row into the projects table in database
    database('projects').insert(project, 'id')
      .then(project => {
        //if successful, respond with status 200 and object with project id
        response.status(200).json({ id: project[0] })
      })
      .catch(error => {
        //if not successful, respond with error and status 500
        response.status(500).json({ error })
      })
  } 
})

//add new palette to database
//name endpoint url
app.post('/api/v1/palettes', (request, response) => {
  //assign request body object to variable palette
  const palette = request.body;

  //check if there is a title property on the request object
  if(!palette.title) {
    //if there isn't, respond with error and status 422
    return response.status(422).send({
      error: 'No palette name provided'
    })
  } else {
    //if there is, add new palette row to palette table
    database('palettes').insert(palette, 'id')
      .then(palette => {
        //if successful, respond with 200 status and object with palette id
        response.status(200).json({ id: palette[0]})
      })
      .catch(error => {
        //if not successful, respond with 500 status and error message
        response.status(500).json({ error })
      })
  }
})

//delete palette from database
//name endpoint url
app.delete('/api/v1/palettes/:id', (request, response) => {
  //delete palette row from palette table where the palette id matches the id from the url
  database('palettes').where('id', request.params.id).del()
    //if successful, respond with status code 204
    .then(id => response.sendStatus(204))
    .catch(error => 
      //if not successful, respond with error message
      response.status(500).json({ error }))
})

//log to console which port the app is running on
app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`)
})

module.exports = {app, database};

