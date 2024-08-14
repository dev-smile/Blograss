import createGrass from "../src/blograss/Blograss.js";
import fetchPosts from "../src/fetchers/posts-fetcher.js";
import { NaverPostsFetcher } from "../src/fetchers/naver/naver-posts-fetcher.js";

export default async (req, res) => {
  // name=계정명
  // type=daily or weekly
  // year=년도
  // blogType=velog || naver
  const { name, type, year, blogType = "velog" } = req.query;

    res.setHeader("Content-Type", "image/svg+xml");
    try {
        const post = blogType === "naver" 
          ? await new NaverPostsFetcher(name).fetchPosts() 
          : await fetchPosts(name);

    return res.send(createGrass(name, type, year, post, blogType));
  } catch (e) {
    return res.send(e.message);
  }
};
