import { getIn } from './../../../lib/tools';

export const Patient = ({ name, gender }: any) => {
  const fullName = getIn(name, [0, 'text']);
  return (
    <div className="p-4 lg:w-1/3 w-1/2">
      <div className="flex rounded-lg h-full bg-blue-500 p-8 flex-col">
        <div className="flex items-center mb-3">
          <h2 className="text-white text-lg title-font font-medium">{fullName}</h2>
        </div>
        <div className="flex-grow">
          <p className="leading-relaxed text-base text-white">{gender}</p>
        </div>
      </div>
    </div>
  );
};
