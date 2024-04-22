require('dotenv').config();
const AppError = require('../utils/AppError');
const { Client } = require("@notionhq/client");
const pageId = process.env.NOTION_PAGE_ID;
const apiKey = process.env.NOTION_API_KEY;
const knex = require('../database');

class NotionServices {
  async updateAndArchiveNotionPage(notionId, user_id) {
    const user = await knex('user').where({ id: user_id }).first();
    const notion = new Client({ auth: user.access_token });
    return notion.pages.update({ page_id: notionId, archived: true });
  }
  async create({ text, title, imageUrl, user }) {
    const notion = new Client({ auth: user.access_token });
    let pageProperties;
    if (imageUrl) {
      pageProperties = {
        "cover": {
          "type": "external",
          "external": {
            "url": imageUrl
          }
        },
        "icon": {
          "type": "emoji",
          "emoji": "☠️"
        },
        parent: { database_id: user.duplicated_template_id },
        "properties": {
          "Name": {
            "title": [
              {
                "text": {
                  "content": title
                }
              }
            ]
          },
        },
        "children": [
          {
            "object": "block",
            "paragraph": {
              "rich_text": [
                {
                  "text": {
                    "content": text,
                  },
                }
              ],
              "color": "default"
            }
          }
        ]
      };
    } else {
      pageProperties = {
        "icon": {
          "type": "emoji",
          "emoji": "☠️"
        },
        parent: { database_id: user.duplicated_template_id },
        "properties": {
          "Name": {
            "title": [
              {
                "text": {
                  "content": title
                }
              }
            ]
          },
        },
        "children": [
          {
            "object": "block",
            "paragraph": {
              "rich_text": [
                {
                  "text": {
                    "content": text,
                  },
                }
              ],
              "color": "default"
            }
          }
        ]
      };
    }
    try {
      const response = await notion.pages.create(pageProperties);

      return response;
    } catch (error) {
      console.log(error);

      throw new AppError(error.message, 404)
    }
  }

}

module.exports = NotionServices;