/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = knex => knex.schema.createTable("user", table => {
    table.string('id').unique();
    table.string('name');
    table.string('email').unique();
    table.string('password');
    table.string('access_token');
    table.string('workspace_name');
    table.string('duplicated_template_id');
    table.string('avatar_url');

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
});


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = knex => knex.schema.dropTable("user");
