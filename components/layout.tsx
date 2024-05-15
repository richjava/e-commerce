import { Intro } from "@/components/shared/intro";

const Layout = (props: any) => {
  if (!props) return <></>;
  const { children, layoutComps, page } = props;

  return (
    <div className="mx-auto md:w-[1000px] my-15">
      {page &&
        layoutComps.length > 0 &&
        layoutComps.map((Section: any, i: number) => {
          return (
            <div key={i}>
              <Section content={page.layout.sections[i].content} />
              {i === page.layout.contentIndex - 1 && <main id="main">{children}</main>}
            </div>
          );
        })}
    </div>
  );
};

export default Layout;
