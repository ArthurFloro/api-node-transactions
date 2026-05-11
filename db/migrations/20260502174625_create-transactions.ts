import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary()
    table.text('title').notNullable()
    table.decimal('amount', 10, 2).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
} // o que essa migration vai fazer

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactions')
} // se der alguma coisa errada, essa função faz o inverso do up
