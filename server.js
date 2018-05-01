const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('port', process.env.PORT || 3000);

// app.use((request, response, next) => {
//   response.header('Access-Control-Allow-Origin', '*')
//   next()
// })

app.locals.title = 'Palette Picker'
app.locals.projects = [{id: 5, project: 'reds'}]

app.get('/', (request, response) => {

})

app.get('/api/v1/projects', (request, response) => {
  console.log(app.locals.projects)
  response.status(200).json(app.locals.projects)
})

app.post('/api/v1/projects', (request, response) => {
  const id = Date.now();
  const { project } = request.body;

  if (!project) {
    return response.status(422).send({
      error: 'No project name provided'
    })
  } else {
    app.locals.projects.push({id, project });
    response.status(200).json({ id, project })
  } 
  console.log(app.locals.projects)
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`)
})



