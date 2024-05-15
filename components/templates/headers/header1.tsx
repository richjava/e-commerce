import { DataView } from "@/components/shared/data-view";
import { Intro } from "@/components/shared/intro";

export default function Header1({ content }: any) {
  if (!content) return <></>;
  return (
    <section id="header-1" className="container template">
      <Intro type="theme" content={content} />
      <DataView sectionName="Header1" content={content} />
    </section>
  );
}
