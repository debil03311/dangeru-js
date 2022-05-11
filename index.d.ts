export async function apiFetch(path: String): Promise<JSON>
export async function getPageCount(board: String): Promise<Number>

export async function getThreads(board: String, pageNumber: String): Promise<Array<Object>>
export async function getReplies(threadId: String): Promise<Array<Object>>

export async function getBoards(): Promise<{
  full: String,
  short: String,
}>

export async function getStats(): Promise<{
  threads: {
    active: Number,
    archived: Number,
  },
  replies: {
    active: Number,
    archived: Number,
  },
  burgs: {
    normal: Number,
    angry: Number,
  }
}>

export async function getNews(arr: []): Promise<{
 date: Date,
 dateString: String,
 announcement: String
}>