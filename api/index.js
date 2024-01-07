import createGrass from "../src/blograss/Blograss.js";
import fetchPosts from "../src/fetchers/posts-fetcher.js";

export default async (req, res) => {
  const { name, type, year } = req.query;
  res.setHeader("Content-Type", "image/svg+xml");
  try {
    const post = await fetchPosts(name, type);
    console.log("[index.js] post :", post);
    return res.send(createGrass(name, type, year, post));
  } catch (e) {
    return res.send(e.message);
  }
};
