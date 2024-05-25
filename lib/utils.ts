import dynamic from "next/dynamic";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

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

export const urlForImage = (source: any) => {
  return `${publicRuntimeConfig.BACKEND_URL || ""}${
    source?.url
  }`
}

export const widthForImage = (source: any) =>
source?.width

export const heightForImage = (source: any) =>
source?.height

export const collectionSlug = (entry: any) =>
entry._type ? entry._type.replace(/[A-Z]/g, (letter:any) => `-${letter.toLowerCase()}`) : '';

export const entrySlug = (entry: any) => entry && entry.slug && entry.slug.current ? entry.slug.current : entry.slug;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}