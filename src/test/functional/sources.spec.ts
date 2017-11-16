import { app } from './../../app';
import { expect, request, ExpressApplication } from "./../testUtils";

describe("Sources API endpoints integration tests", () => {

    describe("GET /api/v1/sources", () => {

        it("should do something", () => {
            return request(app)
            .get('/api/v1/sources')
            .then(res => {
                res.should.have.status(200);
                expect(res.type).to.eql('application/json');
                expect(res.body.response.sources).to.be.a('array');
                // expect(res.body.response.sources).to.have.length(2);
            });
        });

        it('it should GET two news sources', () => {
            return request(app)
            .get('/api/v1/sources?limit=2')
            .then(res => {
                res.should.have.status(200);
                expect(res.type).to.eql('application/json');
                expect(res.body.response.sources).to.be.a('array');
                // expect(res.body.response.sources).to.have.length(2);
            });
        });

        it('it should search for a news source', () => {
            return request(app)
            .get('/api/v1/sources?q=cn')
            .then(res => {
                res.should.have.status(200);
                expect(res.type).to.eql('application/json');
                expect(res.body.response.sources).to.be.a('array');
                // expect(res.body.response.results).to.have.length(1);
                // expect(res.body.response.results[0].name).to.eql('CNN');

                // return Promise.resolve();
            });
        });
    });

    // vars to hold test ids:
    /*
    let newId;
    
    describe('GET /source', () => {

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

            return request(server)
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
            return request(server)
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

            return request(server)
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
            return request(server)
            .del('/source/' + newId)
            .then(res => {
                res.should.have.status(200);
                expect(res.type).to.eql('application/json');
                expect(res.body.response).to.be.a('object');
                expect(res.body.response).to.eql({});
            });
        });

        it('it should throw an error when trying to delete an id that does not exist', () => {
            return request(server)
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
    */
});