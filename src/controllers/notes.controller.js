const NotesRepository = require('../repository/note.repository');

class NotesController {
  async getById(req, res) {
    try {
      const { id } = req.params;
      const note = await NotesRepository.getById(id);
      res.status(200).send({ note });
    } catch (error) {
      res.status(error.statusCode || 500).send({ message: error.message });
    }
  }

  async get(req, res) {
    try {
      const { order } = req.params;
      const user_id = req.user.id;

      const notes = await NotesRepository.getAllOrdered({ order, user_id });
      res.status(200).send(notes);
    } catch (error) {
      res.status(error.statusCode || 500).send({ message: error.message });
    }
  }
  async search(req, res) {
    try {
      const { search, order } = req.params;
      const user_id = req.user.id;

      const notes = await NotesRepository.search({ search, order, user_id });
      res.status(200).send(notes);
    } catch (error) {
      res.status(error.statusCode || 500).send({ message: error.message });
    }
  }

  async favorite(req, res) {
    try {
      const { id } = req.params;
      const message = await NotesRepository.favoriteById(id);
      res.status(200).send({ message });
    } catch (error) {
      res.status(error.statusCode || 500).send({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const message = await NotesRepository.updateById(id, { title, content });
      res.status(200).send({ message });
    } catch (error) {
      res.status(error.statusCode || 500).send({ message: error.message });
    }
  }
  async updateColor(req, res) {
    try {
      const { id } = req.params;
      const { color } = req.body;
      const message = await NotesRepository.updateColorById(id, { color });
      res.status(200).send({ message });
    } catch (error) {
      res.status(error.statusCode || 500).send({ message: error.message });
    }
  }
}

module.exports = new NotesController();
