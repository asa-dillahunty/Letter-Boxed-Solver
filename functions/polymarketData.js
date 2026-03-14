/* eslint-disable */
async function getBySlug(slug) {
  try {
    const options = { method: "GET" };

    const response = await fetch(
      `https://gamma-api.polymarket.com/events/slug/${slug}`,
      options,
    );
    if (response) {
      const res = response.json();
      return res;
    }
  } catch (error) {
    console.error("Error getting event data:", error);
    return null;
  }
}

module.exports = getBySlug;
/* eslint-enable */
