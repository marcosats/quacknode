const userServices = require('../services/user.services');

require('dotenv').config()
const clientId = process.env.OAUTH_CLIENT_ID;
const clientSecret = process.env.OAUTH_CLIENT_SECRET;
const redirectUri = process.env.OAUTH_REDIRECT_URI;

class AuthController {

  async login(req, res) {
    try {
      const { code } = req.body;
      const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
      const response = await fetch("https://api.notion.com/v1/oauth/token", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${encoded}`,
        },
        body: JSON.stringify({
          grant_type: "authorization_code",
          code,
        }),
      });
      const a = await response.json()
      const user = await userServices.checkOrCreateUser(a)
      const responseData = {
        ...user,
      };
      res.send(responseData).json().status(200);

    } catch (error) {
      console.log(error);
    }

  }
}

module.exports = new AuthController();
