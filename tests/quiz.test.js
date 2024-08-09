const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

let token = '';

before((done) => {
  chai.request(app)
    .post('/api/auth/login')
    .send({
      email: 'testuser@example.com',
      password: 'password123'
    })
    .end((err, res) => {
      token = res.body.token;
      done();
    });
});

describe('Quiz API', () => {
  describe('POST /api/quizzes', () => {
    it('should create a new quiz', (done) => {
      chai.request(app)
        .post('/api/quizzes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Sample Quiz',
          questions: [
            {
              questionText: 'What is 2+2?',
              options: [
                { optionText: '4', isCorrect: true },
                { optionText: '3', isCorrect: false }
              ]
            }
          ]
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('_id');
          done();
        });
    });

    it('should not create a quiz without a title', (done) => {
      chai.request(app)
        .post('/api/quizzes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          questions: [
            {
              questionText: 'What is 2+2?',
              options: [
                { optionText: '4', isCorrect: true },
                { optionText: '3', isCorrect: false }
              ]
            }
          ]
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
  });

  describe('GET /api/quizzes', () => {
    it('should get all quizzes', (done) => {
      chai.request(app)
        .get('/api/quizzes')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });

    it('should get a single quiz by ID', (done) => {
      chai.request(app)
        .get('/api/quizzes') // Assuming you know a quiz ID here, replace with a dynamic value
        .end((err, res) => {
          const quizId = res.body[0]._id;
          chai.request(app)
            .get(`/api/quizzes/${quizId}`)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.property('_id').eql(quizId);
              done();
            });
        });
    });
  });

  describe('POST /api/quizzes/:id/submit', () => {
    it('should submit a quiz and return the result', (done) => {
      chai.request(app)
        .get('/api/quizzes')
        .end((err, res) => {
          const quizId = res.body[0]._id;
          chai.request(app)
            .post(`/api/quizzes/${quizId}/submit`)
            .send({
              userName: 'Test User',
              answers: [
                { questionId: res.body[0].questions[0]._id, selectedOption: res.body[0].questions[0].options[0]._id }
              ]
            })
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.property('score');
              done();
            });
        });
    });
  });
});
