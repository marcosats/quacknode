require('dotenv').config();
const DiskStorage = require("../providers/disk.storage")
const MarkdownIt = require('markdown-it');
const plainText = require('markdown-it-plain-text');
const { AssemblyAI } = require('assemblyai');
const GoogleServices = require('../services/google.services');
const NotionServices = require('../services/notion.services');
const NotesRepository = require('../repository/note.repository');
const geminiServices = require('../services/gemini.services');
const knex = require('../database');
const noteRepository = require('../repository/note.repository');


const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLY_KEY,
});
class QuackController {
    async index(request, res) {
        const notionService = new NotionServices()
        const user_id = request.user.id;
        const user = await knex('user').where({ id: user_id }).first();
        //const md = new MarkdownIt();
        const { title, content, color, imageUrl, imageId, fileName } = request.body;
        console.log({ title, content, color, imageUrl, imageId, fileName });
        const text = await geminiServices.generate({ content, fileName })
        /*
        function markdownToText(markdown) {
            md.render(markdown);
            return md.plainText;
        }
        */
        try {
            const formattedText = text;

            const response = await notionService.create({ text: formattedText, title, imageUrl, user })
            const notionUrl = `https://www.notion.so/${response.id.replace(/-/g, '')}`;
            await NotesRepository.create({ title, url: response.url, content, color, imageUrl, imageId, notionId: response.id, user_id, notion_url: notionUrl });
            res.send({ success: true, url: response.url, title: title });

        } catch (error) {
            console.error("Error creating page in Notion:", error);
            res.status(500).json({ success: false, error: "Internal Server Error" });
        }
    }
    async deletePost(req, res) {
        const { notionId } = req.params;

        const user_id = req.user.id;
        const notionService = new NotionServices();
        try {
            const noteInfo = await noteRepository.getByNotionId({ id_notion: notionId })
            await notionService.updateAndArchiveNotionPage(notionId, user_id);
            if (noteInfo.id_image) {
                await GoogleServices.deleteImageFromDrive(noteInfo.id_image);
            }
            await NotesRepository.deleteByNotionId(notionId);

            res.status(200).json({ success: true, message: "Nota deletada com sucesso" });
        } catch (error) {
            console.error("Error deleting post:", error);

            let errorMessage = "Internal Server Error";
            if (error.response && error.response.data) {
                errorMessage = error.response.data.message || errorMessage;
            }

            res.status(500).json({ success: false, error: errorMessage });
        }
    }

    async audio(req, res) {
        const file = req.file;
        const diskStorage = new DiskStorage();
        try {
            const profileFilename = await diskStorage.saveFile(file.filename);
            const FILE_URL = `tmp/uploads/${profileFilename}`;
            const data = {
                audio_url: FILE_URL,
                language_code: 'pt'
            }
            const transcript = await client.transcripts.create(data);
            res.send({ translate: transcript.text }).json().status(201);
            return await diskStorage.deleteFile(profileFilename);
        } catch (error) {

        }
    }
}

module.exports = QuackController;
