import axios from "axios";

export class BasePostsFetcher {
    async fetch(queryURL) {
      const { data } = await axios.get(queryURL);
  
      return data;
    }
  }