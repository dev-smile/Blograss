import { BasePostsFetcher } from "./base-fetcher.js";


export class NaverPostsFetcher {
  baseURL = `https://blog.rss.naver.com`;
  baseFetcher;

  queryURL;
  
  constructor(username) {
    this.baseFetcher = new BasePostsFetcher();
    this.queryURL = `${this.baseURL}/${username}`;
  }

  async fetchPosts() {
    const res = await this.baseFetcher.fetch(this.queryURL);
    return this.parseResponse(res);
  }

  parseResponse(res) {
    const postItemRegex = /<item>(.*?)<\/item>/gs;

    const postItems = res.match(postItemRegex);

    if (postItems === null) return {posts:[]};

    const posts = postItems.map((postItem) => {
        const titleRegex = /<title>(.*?)<\/title>/;
        const linkRegex = /<link>(.*?)<\/link>/;
        const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/;
    
        const title = postItem.match(titleRegex)?.[1] ?? "";
        const link = postItem.match(linkRegex)?.[1] ?? "";
        const pubDate = postItem.match(pubDateRegex)?.[1];
    
        return {
            title,
            link,
            released_at: this.formatDate(pubDate),
            updated_at: this.formatDate(pubDate),
        };
    }).filter((post) => post.released_at !== undefined && post.updated_at !== undefined)

    return {posts};
  }

  formatDate(pubDate) {
    const months = [
      '01', '02', '03', '04', '05', '06',
      '07', '08', '09', '10', '11', '12'
    ];
  
    const dateObj = new Date(pubDate);
  
    const year = dateObj.getFullYear();
    const month = months[dateObj.getMonth()];
    const day = ('0' + dateObj.getDate()).slice(-2);
  
    return `${year}-${month}-${day}`;
  }
}