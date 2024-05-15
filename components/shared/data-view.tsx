import React from "react";

type Props = {
  sectionName: string,
  content: {
    data: any,
    collections: any,
  },
};

export const DataView: React.FC<Props> = ({ sectionName, content }) => {
  if (!content) return null;
  const { data, collections } = { ...content };
  const hasData = data || collections;
  if (hasData) {
    return (
      <div className="border border-solid border-rgb-[var(--card-border-rgb)] bg-white rounded-lg p-5 mb-6">
        {sectionName && (
          <div>
            <h2 className="text-xs opacity-60 mb-6">{sectionName}</h2>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="attributes">
            <h3 className="uppercase text-xs mb-2">Data</h3>
            {(!data || Object.keys(data).length === 0) && <p>No Data</p>}
            <ul>
              {data &&
                Object.keys(data).length > 0 &&
                Object.keys(data).map((attributeName) => (
                  <li className="list-disc leading-[1.5]" key={attributeName}>
                    {attributeName}:
                    {Array.isArray(data[attributeName]) ? (
                      <ul>
                        {data[attributeName].map((item, index) => (
                          <li className="list-disc" key={index}>
                            <ul>
                              {Object.keys(item).map((key) => (
                                <li className="list-disc break-all" key={key}>
                                  {key}: {item[key]}
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    ) : typeof data[attributeName] === "object" ? (
                      <ul>
                        {Object.keys(data[attributeName]).map((key) => (
                          <li className="list-disc" key={key}>
                            {key}: {data[attributeName][key]}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      data[attributeName]
                    )}
                  </li>
                ))}
            </ul>
          </div>
          <div className="mt-5 md:mt-0">
            <h3 className="uppercase text-xs mb-2">Collections</h3>
            {(!collections || Object.keys(collections).length === 0) && (
              <p>No collections</p>
            )}
            <ul className="ml-5">
              {collections &&
                Object.keys(collections).length > 0 &&
                Object.keys(collections).map((collectionName) => (
                  <>
                    <li className="list-disc" key={collectionName}>
                      {collectionName}
                    </li>
                    {collections[collectionName].map((item: any, i: number) => (
                      <ul className="ml-10">
                        <li className="list-disc">{`[${i}]`}</li>
                        <ul className="ml-10">
                          {item &&
                            Object.keys(item).length > 0 &&
                            Object.keys(item).map((attributeName) => (
                              <li className="list-disc break-all" key={attributeName}>
                                {attributeName}:{" "}
                                {typeof item[attributeName] === "object"
                                  ? JSON.stringify(item[attributeName])
                                  : item[attributeName]}
                              </li>
                            ))}
                        </ul>
                      </ul>
                    ))}
                  </>
                ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
