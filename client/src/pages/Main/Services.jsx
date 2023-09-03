import { LockClosedIcon } from "@heroicons/react/24/outline";

const NewCard = () => {
  return (
    <div className="h-40 w-40 border rounded flex justify-center items-center text-zinc-800">
      <LockClosedIcon className="w-16" />
    </div>
  );
};

export default () => {
  return (
    <div className="">
      <NewCard />
    </div>
  );
};
