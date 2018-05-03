const chai = require('chai');
const should = chai.should();
const server = require('../server.js');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Endpoint tests', () => {
  it('should GET all the projects', (done) => {
    chai.request(server)
      .get('/api/v1/projects')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.an('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('title');
        response.body[0].title.should.equal('Warm Tones');
        done();
      })
  });

  it('should GET all the palettes', (done) => {
    chai.request(server)
      .get('/api/v1/palettes/2')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.an('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.property('id');
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
        response.body[0].project_id.should.equal(2);      
        done();
      })
  });

    it('should GET all the palettes', (done) => {
    chai.request(server)
      .post('/api/v1/palettes/2')
      .end((error, response) => {   
        done();
      })
  });
});

