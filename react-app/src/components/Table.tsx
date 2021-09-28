import React from 'react';

const Table = ({ labels, data }: { labels: Array<string>; data: Array<any> }) => {
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col">
          <div className="w-full">
            <div className="border-b border-gray-200 shadow w-full">
              <div className="w-full">
                <div className="bg-gray-50">
                  <div className={`grid grid-rows-1 grid-cols-${labels.length}`}>
                    {labels.map((label) => (
                      <div className="px-6 py-2 text-xs text-gray-500" key={label}>
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white">
                  {data.map((item: any) => {
                    return (
                      <div
                        className={`grid grid-rows-1 grid-cols-${item.length} whitespace-nowrap hover:bg-gray-100 cursor-pointer border-b-2 border-gray-100`}
                      >
                        {item.map((i: any) => (
                          <div className="px-6 py-4 text-sm text-gray-500">{i}</div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Table;
