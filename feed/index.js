const express = require('express');
const chai = require('chai');
const chaiHttp = require('chai-http');
const cors = require('cors');
const app = express();
const connectDB = require('./config/database');

// Import routes
const userRoutes = require('./route/user');
const postRoutes = require('./route/posts');
const indexRoutes = require('./route/index');

// Use routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/', indexRoutes);

chai.use(chaiHttp);

describe('GET /', () => {
    it('should return Hello World!', (done) => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.equal('Hello World!');
                done();
            });
    });
});


connectDB();
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
