const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/search', async (req, res) => {
    const query = req.query.q;
    const url = `https://www.pdfdrive.com/search?q=${encodeURIComponent(query)}`;

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        let results = [];

        $('.file-right').each((i, el) => {
            const title = $(el).find('.file-title').text().trim();
            const link = $(el).find('a').attr('href');
            results.push({ title, link: `https://www.pdfdrive.com${link}` });
        });

        res.json(results);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred');
    }
});

app.get('/download', async (req, res) => {
    const url = req.query.url;

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const downloadLink = $('a.btn.btn-primary').attr('href');

        res.redirect(`https://www.pdfdrive.com${downloadLink}`);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
