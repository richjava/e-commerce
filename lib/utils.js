import dynamic from "next/dynamic";

export async function getComponentMap(sections) {
  return new Promise(async (resolve) => {
    const map = {};
    for (let i = 0; i < sections.length; i++) {
      const template = sections[i].template.doc;
      map["section" + i] = import(
        `../components/templates/${template.category}/${toDashCase(template.name)}.tsx`
      );
    }
    resolve(map);
  });
}

function toDashCase(input) {
  // Check if the input is in camel case
  if (/^[a-z]+(?:[A-Z][a-z]*)*$/.test(input)) {
    return input.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }
  return input;
}

export function getComponents(sections) {
  return new Promise((resolve) => {
    getComponentMap(sections).then((map) => {
      let comps = [];
      for (const key of Object.keys(map)) {
        let comp = dynamic(() => map[key], {
          suspense: false,
        });
        comps.push(comp);
      }
      resolve(comps);
    });
  });
}