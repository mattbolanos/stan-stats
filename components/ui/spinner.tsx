export const Spinner = ({ size = 4 }) => {
  return (
    <div className="flex justify-center items-center shrink-0">
      <div
        className={`w-${size} h-${size} border-2 border-site border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};
