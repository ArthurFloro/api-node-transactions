import { afterAll, beforeAll, test, describe, beforeEach, expect } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../app.js'

describe('Transactions routes', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    beforeEach(() => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
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

    test('should be able to list all transactions', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: "New Transaction",
                amount: 5000,
                type: "credit"
            })

        const cookies = createTransactionResponse.get('Set-Cookie')

        const listTransactionResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies!)
            .expect(200)

        expect(listTransactionResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: "New Transaction",
                amount: 5000,
            })
        ])

    })


    test('should be able to get a specific transaction', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: "New Transaction",
                amount: 5000,
                type: "credit"
            })

        const cookies = createTransactionResponse.get('Set-Cookie')

        const listTransactionResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies!)
            .expect(200)


        const transactionId = listTransactionResponse.body.transactions[0].id

        const getTransactionResponse = await request(app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookies!)
            .expect(200)

        expect(getTransactionResponse.body.transaction).toEqual(expect.objectContaining({
            title: "New Transaction",
            amount: 5000,
        }))

    })

    test('should be able to get the sumary', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: "New Transaction",
                amount: 5000,
                type: "credit"
            })

        const cookies = createTransactionResponse.get('Set-Cookie')

        await request(app.server)
            .post('/transactions')
            .set('Cookie', cookies!)
            .send({
                title: "Debit Transaction",
                amount: 2000,
                type: "debit"
            })


        const sumaryResponse = await request(app.server)
            .get('/transactions/summary')
            .set('Cookie', cookies!)
            .expect(200)

        expect(sumaryResponse.body.summary).toEqual({
            amount: 3000
        })

    })


})

