import React from "react";

interface SpinnerProps {
  color?: string; // Optional prop for color
  size?: string; // Optional prop for size (e.g., "6rem", "4rem")
}

const Spinner: React.FC<SpinnerProps> = ({
  color = "#ffffff",
  size = "6rem",
}) => {
  return (
    <span
      className="loader"
      style={
        {
          "--loader-size": size,
          "--loader-color": color,
        } as React.CSSProperties
      }
    ></span>
  );
};

export default Spinner;
