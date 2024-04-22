/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = knex => knex.schema.createTable("categories", table => {
    table.increments('id');
    table.string('title'); // Alterado para 'string' para armazenar títulos de texto curtos
    table.string('user_id'); // Alterado para 'string' para armazenar títulos de texto curtos
    table.timestamp('created_at').defaultTo(knex.fn.now()); // Alterado para 'timestamp' para armazenar datas de criação
    table.timestamp('updated_at').defaultTo(knex.fn.now()); // Alterado para 'timestamp' para armazenar datas de atualização
});


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = knex => knex.schema.dropTable("categories");
