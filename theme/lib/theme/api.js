const alasql = require("alasql");
const { transformPage } = require("./transform-page");
const { getData } = require("./fetch");
const pluralize = require('pluralize');

async function getPage(config) {
  return new Promise(async (resolve) => {
    let page = await transformPage(config);
    resolve(page);
  });
}

async function getConfig({pageName, params, type}) {
  let typeString = '';
  if (type) {
    typeString = ` AND type = '${type}'`;
  }
  if (!pageName) {
    return null;
  }
  let pagesData = await getData("/data/pages.json");
  if(!pagesData)return null;
  let res = alasql(`SELECT * FROM ? WHERE name = '${pageName}'${typeString}`, [
    pagesData.pages,
  ]);
  let page = res[0];
  
  if (!page) {
    return null;
  }
  if (page.demoSections) {
    page.sections = page.demoSections;
  }
  let layoutData = await getData(`/data/layout.json`);
  if(!layoutData)return null;
  page.layout = layoutData.layout;
  return page;
}

async function getEntries(contentTypeName, filters) {
  if (!contentTypeName) {
    return null;
  }
  let contentTypeData = await getData(`/data/schemas/content-types.json`);
  if(!contentTypeData)return null;
  const contentTypeRes = alasql(
    `SELECT * FROM ? WHERE name = '${contentTypeName}'`,
    [contentTypeData.contentTypes]
  );

  const contentType = contentTypeRes[0] ? contentTypeRes[0] : null;
  if (!contentType) {
    return null;
  }
  let entryData = await getData(
    `/data/collections/${camelCaseToDash(pluralize(contentType.name))}.json`
  );
  if(!entryData)return null;
  let res = alasql(`SELECT * FROM ?`, [entryData.data]);
  return {
    entries: res,
    contentTypeId: contentTypeName,
  };
}

function camelCaseToDash(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

module.exports = {
  getPage,
  getConfig,
  getEntries,
  getData
};
