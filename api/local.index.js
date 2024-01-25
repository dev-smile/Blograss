import express from "express";
import createGrass from "../src/blograss/Blograss.js";
import fetchPosts from "../src/fetchers/posts-fetcher.js";
import { NaverPostsFetcher } from "../src/fetchers/naver/naver-posts-fetcher.js";

const app = express();

const router = express.Router();

router.get("/test", async (req, res) => {

    const { name, type, year, blogType } = req.query;

    res.setHeader("Content-Type", "image/svg+xml");
    try {

        const post = blogType === "naver" 
          ? await new NaverPostsFetcher(name).fetchPosts() 
          : await fetchPosts(name);
    return res.send(createGrass(name, type, year, post, blogType));
  } catch (e) {
    return res.send(e.message);
  }
})

app.use("/", router);

app.listen(3000, () => {
    console.log("server is running on port 3000");
})