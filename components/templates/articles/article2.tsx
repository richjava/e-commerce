import { DataView } from "@/components/shared/data-view";
export default function Article2({ content }: any) {
  if (!content) return <></>;
  return (
    <section id="article2" className="container template">
      <DataView sectionName="Article2" content={content} />
    </section>
  );
}
