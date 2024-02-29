const request = require('supertest')
const { mongooseConnect } = require('../services/mongo')

// REQUIRE FILES
const app = require('../app')

describe('API PLANETS', () => {
    beforeAll(async () => {
        await mongooseConnect()
    })

    describe('Test GET Planets', () => {
        test('It should return 201 success message', async () => {
            const response = await request(app)
                .get('/v1/planets')
                .expect('Content-Type', /json/)
                .expect(201)
        })
    })
})
