function smartTitle(text) {
    return text
      .split(/[-\s]/)
      .map(word => {
        if (["ai", "ml", "crm", "seo", "hr", "ops", "api", "ui", "ux"].includes(word)) {
          return word.toUpperCase();
        }
        if (word === "and") return "&";
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }
  
  export async function loadToolCategories() {
    const modules = import.meta.glob('/src/data/tools/**/**/*.json');
    const categories = {};
  
    for (const path in modules) {
      const mod = await modules[path]();
      const parts = path.split('/');
  
      const slug = parts[parts.length - 2];
  
      const rawSub = parts[parts.length - 1].replace('.json', '');
      const subName = smartTitle(rawSub);
  
      if (!categories[slug]) {
        categories[slug] = {
          slug,
          name: smartTitle(slug),
          total: 0,
          subs: []
        };
      }
  
      const count = Array.isArray(mod.default) ? mod.default.length : 0;
      categories[slug].total += count;
  
      categories[slug].subs.push({
        name: subName,
        count
      });
    }
  
    return Object.values(categories);
  }
  