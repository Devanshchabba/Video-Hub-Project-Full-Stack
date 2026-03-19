import React from "react";

function InlineMessage({
  show = false,
  message = "",
  type = "success",
  className="" // success | error | info
}) {
  if (!show) return null;

  const styles = {
    success: "text-green-600",
    error: "text-red-600",
    info: "text-blue-600"
  };

  return (
    <span className={`text-sm align-middle bg-white  font-medium ${className} ${styles[type]} text-black`}>
      {message}!
    </span>
  );
}

export default InlineMessage;
