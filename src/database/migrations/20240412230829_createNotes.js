/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = knex => knex.schema.createTable("notes", table => {
    table.increments('id');
    table.string('title'); // Alterado para 'string' para armazenar títulos de texto curtos
    table.string('url'); // Alterado para 'string' para armazenar URLs
    table.string('image_url'); // Alterado para 'string' para armazenar URLs
    table.string('color'); // Alterado para 'string' para armazenar URLs
    table.string('user_id'); // Alterado para 'string' para armazenar títulos de texto curtos
    table.string('category_id'); // Alterado para 'string' para armazenar URLs
    table.string('audio_url'); // Alterado para 'string' para armazenar URLs de áudio
    table.text('content'); // Mantido como 'text' para armazenar conteúdo de texto longo
    table.text('id_notion'); // Mantido como 'text' para armazenar conteúdo de texto longo
    table.text('id_image'); // Mantido como 'text' para armazenar conteúdo de texto longo
    table.timestamp('favorite'); // Mantido como 'text' para armazenar conteúdo de texto longo
    table.timestamp('created_at').defaultTo(knex.fn.now()); // Alterado para 'timestamp' para armazenar datas de criação
    table.timestamp('updated_at').defaultTo(knex.fn.now()); // Alterado para 'timestamp' para armazenar datas de atualização
});


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = knex => knex.schema.dropTable("notes");
