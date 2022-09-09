import { useState } from "react";
import { TailsIcon, HeadsIcon } from "../icons/icons";
import "./components.scss";

function Coin() {
  const [side, setSide] = useState(null);

  const [classes, setClasses] = useState("");

  const flipCoin = () => {
    startAnimation();
    Math.random() < 0.5 ? setSide(true) : setSide(false);
  };

  const startAnimation = () => {
    setClasses("animation");
  };

  const onAnimationEnd = () => {
    setClasses("");
  };

  return (
    <div
      onClick={flipCoin}
      className={`coin_container ${classes}`}
      onAnimationEnd={onAnimationEnd}
    >
      <div className="coin">{side ? <HeadsIcon /> : <TailsIcon />}</div>
    </div>
  );
}

export default Coin;
