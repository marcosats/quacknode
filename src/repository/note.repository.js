const knex = require('../database');
const AppError = require('../utils/AppError');

class NotesRepository {
  async getById(id) {
    try {
      const note = await knex('notes').where({ id }).first();
      if (!note) {
        throw new AppError('Nota não encontrada', 404);
      }
      return note;
    } catch (error) {
      throw new AppError('Erro ao buscar nota', 500);
    }
  }
  async getByNotionId({ id_notion }) {
    try {
      const note = await knex('notes').where({ id_notion }).first();
      if (!note) {
        throw new AppError('Nota não encontrada', 404);
      }
      return note;
    } catch (error) {
      throw new AppError('Erro ao buscar nota', 500);
    }
  }

  async getAllOrdered({ order, user_id }) {
    try {
      if (order === 'fav') {
        return await knex('notes').where({ user_id }).whereNotNull('favorite');
      } else {
        return await knex('notes').where({ user_id }).orderBy('created_at', order);
      }
    } catch (error) {
      throw new AppError('Erro ao buscar notas', 500);
    }
  }
  async search({ search, order, user_id }) {
    console.log({ search, order });
    try {
      const query = knex('notes').where({ user_id });

      if (search) {
        query.where(function () {
          this.whereRaw('LOWER(title) like ?', [`%${search.toLowerCase()}%`])
            .orWhereRaw('LOWER(content) like ?', [`%${search.toLowerCase()}%`]);
        });
      }

      query.orderBy('created_at', order);

      return await query;
    } catch (error) {
      throw new AppError('Erro ao buscar notas', 500);
    }
  }




  async favoriteById(id) {
    const date = new Date().toISOString();
    try {
      const note = await this.getById(id);
      if (note.favorite) {
        await knex('notes').update('favorite', null).where({ id });
        return 'Nota removida dos favoritos!';
      } else {
        await knex('notes').update('favorite', date).where({ id });
        return 'Favoritada com sucesso!';
      }
    } catch (error) {
      throw new AppError('Erro ao favoritar nota', 500);
    }
  }

  async updateById(id, { title, content }) {
    try {
      await this.getById(id);
      await knex('notes').update({ title, content }).where({ id });
      return 'Nota atualizada com sucesso!';
    } catch (error) {
      throw new AppError('Erro ao atualizar nota', 500);
    }
  }
  async updateColorById(id, { color }) {
    try {
      await this.getById(id);
      await knex('notes').update({ color }).where({ id });
      return 'Cor atualizada com sucesso!';
    } catch (error) {
      throw new AppError('Erro ao atualizar nota', 500);
    }
  }
  async create({ title, url, content, color, imageUrl, imageId, notionId, user_id, notion_url }) {
    const created_at = new Date();
    try {
      await knex('notes').insert({ title, url, content, color, image_url: imageUrl, created_at, id_notion: notionId, id_image: imageId, user_id, url: notion_url });
      return true;
    } catch (error) {
      console.log(error);
      throw new AppError('Erro ao criar nota', 500);
    }
  }
  async deleteByNotionId(notionId) {
    try {
      const deletedRows = await knex('notes').where({ id_notion: notionId }).del();
      if (deletedRows === 0) {
        throw new AppError('Nota não encontrada', 404);
      }
      return true;
    } catch (error) {
      throw new AppError('Erro ao deletar a nota', 500);
    }
  }
}

module.exports = new NotesRepository();
