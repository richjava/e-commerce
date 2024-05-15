import { withRouter } from "next/router";
import { getConfig } from "../../../theme";
import Page from "../../../lib/page";
import { GetStaticPaths, GetStaticProps  } from "next";

export default withRouter(Page);

export const getStaticProps: GetStaticProps = async ({params}) => {
  const config = await getConfig({
    pageName:"productCategoryList", 
    params
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
