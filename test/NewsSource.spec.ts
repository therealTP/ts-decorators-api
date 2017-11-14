// Useful examples:
// http://mherman.org/blog/2016/11/05/developing-a-restful-api-with-node-and-typescript/#.WbhxGtOGNsM
// http://brianflove.com/2016/11/11/typescript-2-express-mongoose-mocha-chai/ 

// Set ENV to 'TEST' to use a test DB
process.env.ENV = 'TEST';

// Require the dev-dependencies
import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { server } from './../index';
import { db } from './../database/db';
import { NewsSource } from './../api/resources/NewsSource/NewsSource';

let expect = chai.expect;
let should = chai.should();
chai.use(chaiHttp);

describe('News Source Endpoints', () => {
    // Before block, make sure connected to DB: 
    before(() => {
        if (db.connected) {
            return Promise.resolve();
        } else {
            return db.connect();
        }   
    });

    // vars to hold test ids:
    let newId;

    describe('GET /source', () => {
        it('it should GET two news sources', () => {
            return chai.request(server)
            .get('/source?limit=2')
            .then(res => {
                res.should.have.status(200);
                expect(res.type).to.eql('application/json');
                expect(res.body.response.results).to.be.a('array');
                expect(res.body.response.results).to.have.length(2);
            });
        });

        it('it should search for a news source', () => {
            return chai.request(server)
            .get('/source?q=cn')
            .then(res => {
                res.should.have.status(200);
                expect(res.type).to.eql('application/json');
                expect(res.body.response.results).to.be.a('array');
                expect(res.body.response.results).to.have.length(1);
                expect(res.body.response.results[0].name).to.eql('CNN');
            });
        });
    });

    describe('POST /source', () => {
        it('it should POST a news source', () => {
            var newsSource = new NewsSource();
            newsSource.name = 'MSNBC';
            newsSource.websiteUrl = 'www.msnbc.com';
            newsSource.nonProfit = false;
            newsSource.sellsAds = true;
            newsSource.twitterUsername = 'msnbc';
            newsSource.youtubeUsername = 'msnbc';

            return chai.request(server)
            .post('/source')
            .send(newsSource)
            .then(res => {
                res.should.have.status(200);
                expect(res.type).to.eql('application/json');
                expect(res.body.response).to.be.a('object');
                expect(res.body.response).to.have.all.keys([
                    "country",
                    "created",
                    "id",
                    "logoUrl",
                    "name",
                    "nonProfit",
                    "sellsAds",
                    "slug",
                    "twitterUsername",
                    "websiteUrl",
                    "youtubeUsername"
                ]);
                newId = res.body.response.id;
                expect(res.body.response.name).to.eql('MSNBC');
            });
        });
    });

    describe('GET /source/:id', () => {
        it('it should GET a news source by id', () => {
            return chai.request(server)
            .get('/source/' + newId)
            .then(res => {
                res.should.have.status(200);
                expect(res.type).to.eql('application/json');
                expect(res.body.response).to.be.a('object');
                expect(res.body.response).to.have.all.keys([
                    'name',
                    'id',
                    'websiteUrl'
                ]);
                expect(res.body.response.name).to.eql('MSNBC');
                expect(res.body.response.id).to.eql(newId);
            });
        });
    });

    describe('PUT /source/:id', () => {
        it('it should UPDATE a news source', () => {
            let updateBody = {
                websiteUrl: "www.testupdate.com"
            };

            return chai.request(server)
            .put('/source/' + newId)
            .send(updateBody)
            .then(res => {
                res.should.have.status(200);
                expect(res.type).to.eql('application/json');
                expect(res.body.response).to.be.a('object');
                expect(res.body.response.websiteUrl).to.eql(updateBody.websiteUrl);
            });
        });
    });


    describe('DELETE /source/:id', () => {
        it('it should DELETE a news source by id when id exists', () => {
            return chai.request(server)
            .del('/source/' + newId)
            .then(res => {
                res.should.have.status(200);
                expect(res.type).to.eql('application/json');
                expect(res.body.response).to.be.a('object');
                expect(res.body.response).to.eql({});
            });
        });

        it('it should throw an error when trying to delete an id that does not exist', () => {
            return chai.request(server)
            .del('/source/THISISNOTANID')
            .then(res => {
                // res.should.have.status(500);
                expect(res.type).to.eql('application/json');
                // expect(res.body.success).to.eql(false);
            }, err => {
                err.should.have.status(500);
                // expect(err.type).to.eql('application/json');
            });
        });
    });
});