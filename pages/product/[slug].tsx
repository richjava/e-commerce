import { withRouter } from "next/router";
import { getConfig, fetchEntries } from "@builtjs/theme";
import { entrySlug } from "@/lib/theme/utils";
import Page from "@/lib/theme/page";
import { GetStaticPaths,GetStaticProps } from "next";

export default withRouter(Page);

export const getStaticProps: GetStaticProps = async (context) => {
  const config = await getConfig({pageName: "productArticle"});
  config.params = context.params;
  return {
    props: { config }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const name = 'product';
  const allEntries:any = await fetchEntries(name);
  return {
    paths: allEntries.entries.map((entry: any) => `/${name}/${entrySlug(entry)}`) ?? [],
    fallback: true,
  };
}
