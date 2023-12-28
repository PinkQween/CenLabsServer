const bodyParser = require('body-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const robotsParser = require('robots-parser');
const urlModule = require('url');
const app = require('../index')

module.exports = {
  setupRoutes: (app) => {
    app.use(bodyParser.json());

    // Function to fetch and parse HTML content
    async function fetchAndParse(url) {
      try {
        const response = await axios.get(url);
        return cheerio.load(response.data);
      } catch (error) {
        console.error('Error fetching or parsing the page:', error);
        return null;
      }
    }

    // Function to check robots.txt
    async function checkRobotsTxt(url, ignoreRobots) {
      if (ignoreRobots) {
        return null;
      }

      try {
        const robotsUrl = urlModule.resolve(url, '/robots.txt');
        const robotsContent = await axios.get(robotsUrl);
        return robotsParser(robotsUrl, robotsContent.data);
      } catch (error) {
        console.error('Error fetching or parsing robots.txt:', error);
        return null;
      }
    }

    // Function to extract information from the parsed HTML
    function extractInformation($) {
      const title = $('title').text();
      const description = $('meta[name="description"]').attr('content');
      const url = $('meta[property="og:url"]').attr('content') || $('meta[name="twitter:url"]').attr('content');

      return { title, description, url };
    }

    // Function to crawl a single page
    async function crawlPage(url, visitedUrls, robotsTxt, ignoreRobots) {
        if (visitedUrls.has(url)) {
          return null; // Avoid crawling the same URL again to prevent infinite loops
        }
      
        visitedUrls.add(url);
      
        if (!ignoreRobots && robotsTxt && !robotsTxt.isAllowed(url, 'your-user-agent')) {
          console.log('Not allowed by robots.txt:', url);
          // Return early and don't crawl this URL
          return null;
        }
      
        const $ = await fetchAndParse(url);
        if ($) {
          const information = extractInformation($);
      
          // Extract links and crawl them
          const links = [];
          $('a').each((index, element) => {
            const link = $(element).attr('href');
            if (link) {
              const absoluteLink = urlModule.resolve(url, link);
              links.push(absoluteLink);
            }
          });
      
          const childResults = await crawlPages(links, visitedUrls, robotsTxt, ignoreRobots);
          return { ...information, children: childResults };
        }
      
        return null;
      }
      
    // Function to crawl multiple pages
    async function crawlPages(urls, visitedUrls, robotsTxt, ignoreRobots) {
      const results = [];
      for (const url of urls) {
        const information = await crawlPage(url, visitedUrls, robotsTxt, ignoreRobots);
        if (information) {
          results.push(information);
        }
      }
      return results;
    }

    // Express API endpoint to start crawling
    app.post('/crawl', async (req, res) => {
      const { startUrl, ignoreRobots } = req.body;

      if (!startUrl) {
        return res.status(400).json({ error: 'Missing startUrl in the request body' });
      }

      try {
        const robotsTxt = await checkRobotsTxt(startUrl, ignoreRobots);
        const result = await crawlPage(startUrl, new Set(), robotsTxt, ignoreRobots);
        res.json(result); 
      } catch (error) {
        console.error('Error crawling pages:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  }
}