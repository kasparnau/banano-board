import { RadioGroup } from "@headlessui/react";
import Separator from "components/Separator";
import Services from "./Services.jsx";
import Tasks from "./Tasks.jsx";
import { useState } from "react";

export default () => {
  return (
    <div className="flex flex-col gap-16 w-full">
      <div className="flex flex-col">
        <h1 className="font-bold text-2xl">Tasks</h1>
        <p className="text-zinc-400">
          Request something to be done in exchange for bananos.
        </p>
        <Separator />
        <Tasks />
      </div>
      <div className="flex flex-col">
        <h1 className="font-bold text-2xl">Services - COMING SOON</h1>
        <p className="text-zinc-400">
          Offer your freelance services to people in exchange for bananos.
        </p>
        <Separator />
        <Services />
      </div>
    </div>
  );
};
