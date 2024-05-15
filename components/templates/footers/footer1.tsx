import { DataView } from "@/components/shared/data-view";
import Links from "@/components/shared/links";

export default function Footer1({ content }: any) {
  if (!content) return <></>;
  return (
    <section id="footer1" className="container template">
      <DataView sectionName="Footer1" content={content} />
      <Links />
      <div className="mt-10 py-10 text-center">
        Built by{" "}
        <a className="underline" href="https://builtjs.com">
          Built.js
        </a>
      </div>
    </section>
  );
}
