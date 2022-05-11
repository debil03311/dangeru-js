const axios = require("axios");
const cheerio = require("cheerio");

const baseUrl = "https://dangeru.us";
const apiEndpoint = `${baseUrl}/api/v2`;

async function apiFetch(path) {
  return await axios.get(apiEndpoint + path)
    .catch(console.error)
}

async function getNews() {
  const html = await axios.get(baseUrl)
    .then((response)=> response.data)
    .catch(console.error)

  const $ = cheerio.load(html);
  const redtext = $("#index-news .redtext").text();

  // The date should be the first thing in the announcement
  // and follow the format of "DD/MM/YY".

  // Should. Pray that it is.

  const dateString = redtext
    .match(/[\w\d\/]+/)[0]

  // Flip date around
  const dateArray = dateString
    .split("/")
    .reverse()

  // If for some reason something's missing from the date
  // prepend the current year to it
  if (dateArray.length < 3)
    dateArray.unshift(new Date().getFullYear);

  // Better safe than sorry right
  const yearLength = dateArray[0].length;

  // Literally shaking and crying rn
  if (yearLength < 4) {
    const yearPrefix = new Date()
      .getFullYear()
      .toString()
      .slice(0, 4 - yearLength)

    dateArray[0] = yearPrefix + dateArray[0];
  }

  // Please work I don't want to put like 3 entire
  // try-catch blocks in here please
  return {
    date: new Date(dateArray.join("/")) || undefined,
    dateRaw: dateString,
    announcement: redtext.match(/\s(.*)/)[1],
  }
}

async function getStats() {
  const html = await axios.get(baseUrl)
    .then((response)=> response.data)
    .catch(console.error)

  const $ = cheerio.load(html);

  const numbers = $(".comment-styled.boarda-margin.index-links span[style='font-weight: bold;']")
    .map((_, span)=> parseInt( $(span).text() ))

  return {
    threads: {
      active: numbers[0],
      archived: numbers[2],
    },
    replies: {
      active: numbers[1],
      archived: numbers[3],
    },
    burgs: {
      normal: numbers[4],
      angry: numbers[5],
    }
  }
}

async function getBoards() {
  // You can only retrieve the short board names
  // from the API, so let's scrape them from the
  // front page instead.

  // const boards = await apiFetch("/boards")
  //   .then((response) => response.data)

  const html = await axios.get(baseUrl)
    .then((response)=> response.data)
    .catch(console.error)

  const $ = cheerio.load(html);

  // Get all the board link tags
  const boards = $("#index-boards a")
    .map((_, anchor)=> ({
      long: $(anchor).text(),
      short: anchor.attribs.href
        .match(/(?!\/)[^\/]+/g)
        .reverse()[0],
    }))
    .toArray()

  return boards;
}

async function getThreads(board, pageNumber=0) {
  const threads = await apiFetch(`/board/${board}?page=${pageNumber}`)
    .then((response) => response.data)
    .catch(console.error)
  
  if (!threads || !threads.length) {
    console.error(new Error(
      `Page ${pageNumber + 1} of /${board}/ does not exist.`));
  }

  return threads;
}

async function getPageCount(board) {
  const html = await axios.get(`${baseUrl}/${board}`)
    .then((response)=> response.data)
    .catch(console.error)

  const $ = cheerio.load(html);

  return parseInt(
    $(".pagecount").last().text())
}

async function getReplies(threadId) {
  return await apiFetch(`/thread/${threadId}/replies`)
    .then((response) => response.data)
    .catch(console.error)
}

module.exports = {
  apiFetch,
  getNews,
  getStats,
  getBoards,
  getThreads,
  getReplies,
  getPageCount,
}