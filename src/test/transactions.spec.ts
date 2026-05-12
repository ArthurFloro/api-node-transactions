import { afterAll, beforeAll, test, describe } from 'vitest'
import request from 'supertest'
import { app } from '../app.js'

describe('Transactions routes', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })


    test('O usuario consegue criar uma nova transação', async () => {
        await request(app.server)
            .post('/transactions')
            .send({
                title: "New Transaction",
                amount: 5000,
                type: "credit"
            })
            .expect(201)

    })

})

