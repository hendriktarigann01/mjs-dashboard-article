const generateSlug = (title) => {
  return title
    .toLowerCase()
    .normalize("NFD") // separate characters + diacritics
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics (é → e)
    .replace(/[^a-z0-9\s-]/g, "") // remove characters other than letters, numbers, spaces, and hyphens
    .trim()
    .split(/\s+/)
    .slice(0, 5)
    .join("-");
};

module.exports = { generateSlug };
