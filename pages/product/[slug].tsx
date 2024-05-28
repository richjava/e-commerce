import { withRouter } from "next/router";
import { getConfig, getEntries } from "@builtjs/theme";
import { entrySlug } from "@/lib/theme/utils";
import Page from "@/lib/theme/page";
// FIXME
import { GetStaticPaths,GetStaticProps } from "next";

export default withRouter(Page);

// FIXME
// export async function getStaticProps() {
//   const config = await getConfig("productArticle");
//   return {
//     props: { config },
//   };
// }

export const getStaticProps: GetStaticProps = async (context) => {
  const config = await getConfig("productArticle");
  config.params = context.params;
  return {
    props: { config }
  };
};

// FIXME
export const getStaticPaths: GetStaticPaths = async () => {
  const name = 'product';
  const allEntries:any = await getEntries(name);
  return {
    paths: allEntries.entries.map((entry: any) => `/${name}/${entrySlug(entry)}`) ?? [],
    fallback: true,
  };
}
