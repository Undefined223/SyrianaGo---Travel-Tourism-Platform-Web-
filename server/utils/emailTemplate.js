const fs = require("fs/promises");
const path = require("path");

async function loadTemplate(templateName, placeholders = {}) {
  const templatePath = path.join(__dirname, "../emails", templateName);
  let template = await fs.readFile(templatePath, "utf8");

  for (const [key, value] of Object.entries(placeholders)) {
    const regex = new RegExp(`{{${key}}}`, "g");
    template = template.replace(regex, value);
  }
  return template;
}

module.exports = {
  loadTemplate,
};
