import fetchPost from "../src/fetchers/post-fetcher.js";

export default async (req, res) => {
  const { name } = req.query;
  try {
    const post = await fetchPost(name);
    const url = new String(`https://velog.io/@${post.user.username}`);
    res.send(`<script>window.location.href='${url}'</script>`);
    return;
  } catch (e) {
    return res.send(e.message);
  }
};
