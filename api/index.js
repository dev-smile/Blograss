import createCard from "../src/cards/new-log.js";
import createCardDark from "../src/cards/new-log-black.js";
import fetchPosts from "../src/fetchers/posts-fetcher.js";
import fetchReadPost from "../src/fetchers/readpost-fetcher.js";

export default async (req, res) => {
  const { name, tag, color, slug } = req.query;
  res.setHeader("Content-Type", "image/svg+xml");
  try {
    const post = !slug
      ? await fetchPosts(name)
      : await fetchReadPost(name, slug);
    console.log("[index.js] post :", post);
    return res.send(
      color === "dark" ? createCardDark(post) : createCard(name, post)
    );
  } catch (e) {
    return res.send(e.message);
  }
};
