import { DataView } from "@/components/shared/data-view";
export default function Block2({ content }: any) {
  if (!content) return <></>;
  return (
    <section id="block2" className="container template">
      <DataView sectionName="Block2" content={content} />
    </section>
  );
}
