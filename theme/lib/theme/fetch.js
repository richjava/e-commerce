const alasql = require("alasql");
const pluralize = require("pluralize");


async function getData(path) {
  return new Promise(async (resolve, reject) => {
    let data = null;
    try {
      data = require(`../../../public${path}`);
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
}

const fetchEntry = async (contentTypeName, queryParams) => {
  if (!contentTypeName) {
    return null;
  }
  let contentTypeData = null;
  try {
    contentTypeData = require("../../../public/data/schemas/content-types.json");
  } catch (err) {
    console.error(err);
    return null;
  }
  if (!contentTypeData) return null;
  const contentTypeRes = alasql(
    `SELECT * FROM ? WHERE name = '${contentTypeName}'`,
    [contentTypeData.contentTypes]
  );
  const contentType = contentTypeRes[0] ? contentTypeRes[0] : null;
  if (!contentType) {
    return;
  }
  let entryData = await getData(
    `/data/collections/${camelCaseToDash(pluralize(contentType.name))}.json`
  );
  console.log({entryData})
  const queryString = generateQuery(queryParams);
  if (!entryData) return null;
  let res = alasql(queryString, [
    entryData.data,
  ]);
  return res.length ? res[0] : null;
};

function generateQuery(conditions) {
  let queryString = "SELECT * FROM ? WHERE ";

  // Iterate over the conditions array and append each condition to the query string
  conditions.forEach((condition, index) => {
    // Get the key and value of each condition object
    const key = Object.keys(condition)[0];
    const value = condition[key];

    // Append the key-value pair of the condition
    queryString += `${key} = '${value}'`;

    // Add 'AND' if it's not the last condition
    if (index < conditions.length - 1) {
        queryString += " AND ";
    }
});


  return queryString;
}

// const fetchEntry = async (contentTypeName, entrySlug) => {
//   if (!contentTypeName) {
//     return null;
//   }
//   let contentTypeData = null;
//   try {
//     contentTypeData = require("../../../public/data/schemas/content-types.json");
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
//   if (!contentTypeData) return null;
//   const contentTypeRes = alasql(
//     `SELECT * FROM ? WHERE name = '${contentTypeName}'`,
//     [contentTypeData.contentTypes]
//   );
//   const contentType = contentTypeRes[0] ? contentTypeRes[0] : null;
//   if (!contentType) {
//     return;
//   }
//   let entryData = await getData(
//     `/data/collections/${camelCaseToDash(pluralize(contentType.name))}.json`
//   );
//   console.log({entryData})
//   console.log(`SELECT * FROM ? WHERE slug ='${entrySlug}'`)
//   if (!entryData) return null;
//   let res = alasql(`SELECT * FROM ? WHERE slug ='${entrySlug}'`, [
//     entryData.data,
//   ]);
//   return res.length ? res[0] : null;
// };

const fetchEntryById = async (collectionName, entryId, isMultiple) => {
  if (!collectionName) {
    return null;
  }
  let entryData = await getData(
    `/data/collections/${pluralize(collectionName)}.json`
  );
  if (!entryData) return null;
  let res = alasql(`SELECT * FROM ? WHERE _id='${entryId}'`, [entryData.data]);
  return res.length ? res[0] : null;
};

const fetchEntries = async (contentTypeName, filters) => {
  if (!contentTypeName) {
    return null;
  }
  let contentTypeData = await getData(`/data/schemas/content-types.json`);
  if (!contentTypeData) return null;
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
  if (!entryData) return null;
  let res = alasql(`SELECT * FROM ?`, [entryData.data]);
  return {
    entries: res,
    contentTypeId: contentTypeName,
  };
};

const fetchCollections = async (section, params) => {
  if (!section) {
    return null;
  }
  if (!section.collections) {
    return [];
  }
  let newCollections = {};
  
  const whereClause = Object.entries(params).map(([key, value]) => `${key} = '${value}'`).join(' AND ');
  
  for (const key in section.collections) {
    const collection = section.collections[key];
    let limit = collection.limit;
    let entryData = await getData(
      `/data/collections/${camelCaseToDash(pluralize(key))}.json`
    );
    if (!entryData) return null;
    let res = alasql(`SELECT * FROM ? ${whereClause ? "WHERE " + whereClause : ''} ` + (limit ? ` LIMIT ${limit}` : ""), [
      entryData.data,
    ]);
    let newCollection = { ...collection };
    if (collection.config && collection.config.populate) {
      for (let i = 0; i < res.length; i++) {
        let entry = res[i];
          if (collection.config.populate) {
            entry = await getPopulateValue(entry, collection.config.populate);
          }
        }
      }
    newCollection = res;
    newCollections[key] = newCollection;
  }
  return newCollections;
};

async function getPopulateValue(entry, pagePopConfigs) {
  for (let j = 0; j < pagePopConfigs.length; j++) {
    let popValue = null;
    const popConfig = pagePopConfigs[j];
    console.log({popConfig})
    const populateName = popConfig.name;
    const toPopulate = entry[populateName];
    if (Array.isArray(toPopulate)) {
      let entries = [];
      let populatedEntry = null;
      for (let i = 0; i < toPopulate.length; i++) {
        const itemToPopulate = toPopulate[i];
        populatedEntry = await populateConfig(
          camelCaseToDash(pluralize(populateName)),
          itemToPopulate,
          true
        );
        if (popConfig.populate) {
          populatedEntry = await getPopulateValue(
            populatedEntry,
            popConfig.populate
          );
        }
        entries.push(populatedEntry);
      }
      popValue = entries;
    } else {
      let contentTypeData = await getData(`/data/schemas/content-types.json`);
      if (!contentTypeData) return null;
      const contentTypeRes = alasql(
        `SELECT * FROM ? WHERE name = '${populateName}'`,
        [contentTypeData.contentTypes]
      );
      const contentType = contentTypeRes[0] ? contentTypeRes[0] : null;
      if (!contentType) {
        return null;
      }
      const collectionName = camelCaseToDash(pluralize(contentType.name));
      const populatedEntry = await populateConfig(collectionName, toPopulate);
      popValue = populatedEntry;
      if (popConfig.populate) {
        popValue = await getPopulateValue(popValue, popConfig.populate);
      }
    }
    entry[populateName] = popValue;
  }
  return entry;
}

async function populateConfig(collectionName, popConfig, isMultiple) {
  if (!popConfig) {
    return;
  }
  let id = null;
  if (popConfig.data) {
    id = popConfig.data._id;
  } else {
    id = popConfig;
  }
  const populatedEntry = await fetchEntryById(collectionName, id, isMultiple);
  return populatedEntry;
}

const fetchPage = async (pageName, type) => {
  if (type) {
    typeString = ` AND type = '${type}`;
  }
  if (!pageName) {
    return null;
  }
  let pagesData = await getData("/data/pages.json");
  if (!pagesData) return null;
  let res = alasql(`SELECT * FROM ? WHERE name = '${pageName}'${typeString}`, [
    pagesData.pages,
  ]);
  if (res.length) {
    let layoutData = await getData(`/data/layout.json`);
    res[0].layout = layoutData.layout;
    return res[0];
  }
  return null;
};

const fetchSection = async (sectionName) => {
  if (!sectionName) {
    return null;
  }

  let sectionData = await getData(`/data/sections.json`);
  if (!sectionData) return null;
  let res = alasql(`SELECT * FROM ? WHERE name = ${sectionName}`, [
    sectionData.sections,
  ]);
  return res.length ? res[0] : null;
};

const fetchTemplate = async (templateName) => {
  if (!templateName) {
    return null;
  }
  let templateData = await getData(`/data/templates.json`);
  if (!templateData) return null;
  let res = alasql(`SELECT * FROM ? WHERE name = ${templateName}`, [
    templateData.templates,
  ]);
  return res.length ? res[0] : null;
};

function camelCaseToDash(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

module.exports = {
  getData,
  fetchEntry,
  fetchEntryById,
  fetchEntries,
  fetchCollections,
  fetchPage,
  fetchSection,
  fetchTemplate,
  getPopulateValue,
};
