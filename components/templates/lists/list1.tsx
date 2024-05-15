import { DataView } from "@/components/shared/data-view";

export default function List1({ content }: any) {
  if (!content) return <></>;
  return (
    <section id="list-1" className="container template">
      <DataView sectionName="List1" content={content} />
    </section>
  );
}