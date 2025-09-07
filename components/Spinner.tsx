import React from "react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px] ">
      <div className="w-8 h-8 border-4 rounded-full border-blue-600 border-t-transparent animate-spin " />
    </div>
  );
};

export default Spinner;
