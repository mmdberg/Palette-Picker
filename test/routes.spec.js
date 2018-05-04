const chai = require('chai');
const should = chai.should();
const { app, database } = require('../server.js');
const chaiHttp = require('chai-http');
// const knex = require('../knexfile')

chai.use(chaiHttp);

describe('Endpoint tests', () => {

  beforeEach((done) => {
    database.migrate.rollback()
      .then(() => {
      database.migrate.latest()
      .then(() => {
        return database.seed.run()
      .then(() => {done()})
      })
    })
  })

  it('should return 404 for a nonexistent route', (done) => {
    chai.request(app)
      .get('/boooop')
      .end((error, response) => {
        response.should.have.status(404);
        done()
      })
  });

  it('should GET all the projects', (done) => {
    chai.request(app)
      .get('/api/v1/projects')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.an('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('id'); 
        response.body[0].id.should.equal(1);    
        response.body[0].should.have.property('title');
        response.body[0].title.should.equal('Warm Tones');
        done();
      })
  });

  it('should GET all the palettes', (done) => {
    chai.request(app)
      .get('/api/v1/palettes/1')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.an('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.property('id');  
        response.body[0].id.should.equal(1);    
        response.body[0].should.have.property('title');
        response.body[0].title.should.equal('summer');
        response.body[0].should.have.property('color1');
        response.body[0].color1.should.equal('blue');
        response.body[0].should.have.property('color2');
        response.body[0].color2.should.equal('red');
        response.body[0].should.have.property('color3');
        response.body[0].color3.should.equal('orange');
        response.body[0].should.have.property('color4');
        response.body[0].color4.should.equal('yellow');
        response.body[0].should.have.property('color5');
        response.body[0].color5.should.equal('purple');   
        response.body[0].should.have.property('project_id');
        response.body[0].project_id.should.equal(1);      
        done();
      })
  });

  it('should POST a project', (done) => {
    chai.request(app)
      .post('/api/v1/projects')
      .send({
        title: 'Cool Tones'
      })
      .end((error, response) => { 
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');  
        response.body.should.have.property('id');
        response.body.id.should.equal(2);
        done();
      });
  });

  it('should not POST a project without data', (done) => {
    chai.request(app)
      .post('/api/v1/projects')
      .end((error, response) => {
        response.should.have.status(422);
        response.body.should.have.property('error');
        response.body.error.should.equal('No project name provided');
        done()
      })
  })

  it('should POST a palette', (done) => {
    chai.request(app)
      .post('/api/v1/palettes')
      .send({
        id: 3,
        title: 'Nature',
        color1: 'blue',
        color2: 'orange',
        color3: 'green',
        color4: 'gold',
        color5: 'magenta',
        project_id: 1
      })
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.have.property('id');
        response.body.id.should.equal(3);
        done();
      });
  });

  it('should not POST a palette without data', (done) => {
    chai.request(app)
      .post('/api/v1/palettes')
      .end((error, response) => {
        response.should.have.status(422);
        response.body.should.have.property('error');
        response.body.error.should.equal('No palette name provided');
        done();
      })
  })

  it('should DELETE a palette', (done) => {
    chai.request(app)
      .delete('/api/v1/palettes/1')
      .end((error, response) => {
        response.should.have.status(204);
        done();
      });
  });



});

