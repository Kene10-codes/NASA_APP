const request = require('supertest')
const app = require('../app')

const { mongooseConnect } = require('../services/mongo')

describe('API LAUNCHES', () => {
    beforeAll(async () => {
        await mongooseConnect()
    })

    describe('GET Launches', () => {
        test('It should return 200 success messages', async () => {
            await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200)
        })
    })

    describe('Test POST Launch', () => {
        const completedLaunchedData = {
            mission: 'SKY ROCKET 001',
            rocket: 'TNT 30',
            target: 'Kepler-1652 b',
            launchDate: 'December 20, 2045',
        }

        const launchDataWithoutDate = {
            mission: 'SKY ROCKET 001',
            rocket: 'TNT 30',
            target: 'Kepler-1652 b',
        }

        const IncompletedLaunchedData = {
            mission: 'SKY ROCKET 001',
            rocket: 'TNT 30',
            target: 'Kepler-1652 b',
        }

        const LaunchedDataWithInvalidDate = {
            mission: 'SKY ROCKET 001',
            rocket: 'TNT 30',
            target: 'Kepler-1652 b',
            launchDate: 'james',
        }

        test('It should return 201 success message', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completedLaunchedData)
                .expect('Content-Type', /json/)
                .expect(201)

            const requestDate = new Date(
                completedLaunchedData.launchDate
            ).valueOf()
            const responseDate = new Date(response.body.launchDate).valueOf()

            expect(requestDate).toBe(responseDate)

            expect(response.body).toMatchObject(launchDataWithoutDate)
        })

        test('It should catch missing launch field', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(IncompletedLaunchedData)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(response.body).toStrictlyEqual({
                error: 'Missing Launch Field',
            })
        })

        test('It should catch Invalid date', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(LaunchedDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(response.body).toStrictEqual({
                error: 'Inavlid date format',
            })
        })
    })
})
