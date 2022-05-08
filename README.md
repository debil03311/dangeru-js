# dangeru.js

An asynchronous JavaScript API wrapper for the [danger/u/](https://dangeru.us/) textboard.

## Example usage

Import the module

```javascript
const dangeru = require("dangeru-js");
```

Get the available boards

**NOTE:** This data is scraped from the front page since the API doesn't provide the full board names

```javascript
const boards = await dangeru.getBoards();
```
```javascript
[
  {
    short: "a",
    long: "Anime & Manga"
  },
  ...boards
]
```

Get threads from the third page of the Technology (`/tech/`) board. The page index can be omitted and defaults to `0`.

```javascript
const threads = await dangeru.getThreads("tech", 2);
```
```javascript
[
  {...threadObject},
  ...threads
]
```

Get the replies to thread no. 376318

```javascript
const replies = await dangeru.getReplies(376318);
```
```javascript
[
  {...replyObject},
  ...replies
]
```

Get the amount of pages that the `/u/` board has

**NOTE:** This data is scraped from the front page since it's not provided by the API

```javascript
const threads = await dangeru.getPageCount("u");
```
```javascript
5
```

Get the front page statistics

**NOTE:** This data is scraped from the front page since it's not provided by the API

```javascript
const stats = await dangeru.getStats();
```
```javascript
{
  threads: {
    active: 294,
    archived: 96801,
  },
  replies: {
    active: 8281,
    archived: 698258,
  },
  burgs: {
    normal: 51937,
    angry: 53127,
  }
}
```

Get the front page news announcement

**WARNING:** This may break if the date format in the announcement changes in the future

```javascript
const news = await dangeru.getNews();
```
```javascript
{
  announcement: "Song-chan's in trouble! If you can spare it, please help: https://dangeru.us/u/thread/828545",
  dateRaw: "18/02/22",
  date: Fri Feb 18 2022 00:00:00 GMT+0200 (Eastern European Summer Time)
}
```