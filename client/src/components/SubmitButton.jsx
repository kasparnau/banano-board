import Loader from "./Loader";

const SubmitButton = ({ disabled, text, fit }) => {
  return (
    <button
      className={`h-[37px] rounded-md text-sm transition-colors ${
        !disabled
          ? `bg-black text-white border hover:bg-zinc-800`
          : `bg-black text-zinc-400 border`
      } font-semibold flex justify-center items-center ${
        fit ? "w-fit px-4" : "w-full"
      }`}
      type="submit"
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default SubmitButton;
