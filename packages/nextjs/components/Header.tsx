import React from "react";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

/**
 * Site header
 */
export const Header = () => {
  return (
    <div className="sticky lg:static top-0 navbar bg-base-300 min-h-0 flex-shrink-0 justify-between z-20 p-0 sm:pl-2 text-base-100 font-pixel">
      <div className="navbar-end flex-grow">
        <RainbowKitCustomConnectButton />
      </div>
    </div>
  );
};
