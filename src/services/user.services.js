const knex = require('../database');
const bcrypt = require('bcryptjs');
const authConfig = require('../configs/auth');
const { sign } = require('jsonwebtoken');

class UserServices {
  async checkOrCreateUser(user) {
    try {
      // Ensure user and user.owner exist
      if (!user || !user.owner || !user.owner.user || !user.owner.user.id) {
        throw new Error('Invalid user object provided');
      }

      const existingUser = await knex('user').where({ id: user.owner.user.id }).first();
      if (existingUser) {
        return { success: false }; // Return existing user if found
      } else {
        // Create a new user if not found
        await knex('user').insert({
          id: user.owner.user.id,
          name: user.owner.user.name,
          access_token: user.access_token,
          email: user.owner.user.person.email,
          workspace_name: user.workspace_name,
          avatar_url: user.owner.user.avatar_url,
          duplicated_template_id: user.duplicated_template_id,
        });

        const newUser = await knex('user').where('id', user.owner.user.id).first();
        const resposta = {
          ...newUser,
          success: true
        }
        return resposta;
      }
    } catch (error) {
      console.log('Error checking or creating user:', error);
      throw new Error('Error checking or creating user');
    }
  }
  async updatePasswordAndGenerateToken(req, res) {
    try {
      const { password, id } = req.body
      // Encrypt the password
      const hashedPassword = await bcrypt.hash(password, 8);

      // Update the user's password in the database
      await knex('user').where({ id }).update({ password: hashedPassword });
      const user = await knex('user').where({ id }).select().first();
      const { secret, expiresIn } = authConfig.jwt;
      const token = sign({}, secret, {
        subject: String(user.id),
        expiresIn
      });

      res.send({ token, user }).status(200).json();
    } catch (error) {
      console.log('Error updating password and generating token:', error);
      throw new Error('Error updating password and generating token');
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      // Busca o usuário pelo email
      const user = await knex('user').where({ email }).first();
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Verifica se a senha está correta
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new Error('Senha incorreta');
      }

      // Gera o token de autenticação
      const { secret, expiresIn } = authConfig.jwt;
      const token = sign({}, secret, {
        subject: String(user.id),
        expiresIn
      });

      res.send({ token, user }).status(200).json();
    } catch (error) {
      console.log('Erro durante o login:', error);
      throw new Error('Erro durante o login');
    }
  }
  async updateName(req, response) {
    const { name } = req.body;
    const user_id = req.user.id;
    try {
      await knex('user').update({ name }).where({ id: user_id });
      const user = await knex('user').where({ id: user_id }).first();
      console.log({ user });
      return response.send({ user }).json().status(200);
    } catch (error) {
      console.log(error);
      throw new AppError('Erro ao atualizar nota', 500);
    }
  }
}

module.exports = new UserServices();
