import { useState } from "react";

export const useSpinner = () => {
  const [spinning, setSpinning] = useState(false);

  const startSpin = () => setSpinning(true);

  const endSpin = () => setSpinning(false);

  return { spinning, startSpin, endSpin };
};
