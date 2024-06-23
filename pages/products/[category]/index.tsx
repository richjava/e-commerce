import { withRouter } from "next/router";
import { getConfig } from "@builtjs/theme";
import Page from "../../../lib/theme/page";
import { GetStaticPaths, GetStaticProps  } from "next";


export default withRouter(Page);

export const getStaticProps: GetStaticProps = async () => {
  const config = await getConfig({
    pageName:"productCategoryList"
  });
  return {
    props: { config },
  };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {

  return {
      paths: [],
      fallback: 'blocking'
  }
}
