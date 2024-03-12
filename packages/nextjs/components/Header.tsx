import React from "react";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

/**
 * Site header
 */
export const Header = () => {
  return (
    <div className="sticky lg:static top-0 navbar bg-base-300 min-h-0 flex-shrink-0 justify-between z-20 p-0 sm:pl-2 text-base-100 font-pixel">
      {/* <div className="navbar-start w-auto sm:w-1/2">
        <div className="sm:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-primary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <div
              tabIndex={0}
              className="menu-compact dropdown-content p-8 bg-base-200 w-80 h-256 flex flex-col gap-8"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <Link href="/" passHref className="flex items-center gap-2 ml-4 mr-6 shrink-0">
                <div className="flex flex-col relative">
                  <Image
                    alt="ETH Latam logo"
                    className="cursor-pointer"
                    src="/logo_black.svg"
                    width="125"
                    height="125"
                    style={{
                      filter: `invert(${isDarkMode ? "0%" : "100%"})`,
                    }}
                  />
                  {/* <div className="font-bold leading-tight text-sm">ETH Latam Faucet</div>
                </div>
              </Link>
              {isLocalNetwork && <Faucet />}
              {isLocalNetwork && (
                <Link href="/blockexplorer" passHref className="btn btn-primary btn-sm font-normal normal-case gap-1">
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  <span>Block Explorer</span>
                </Link>
              )}
              <SwitchTheme className="pointer-events-auto" />
            </div>
          )}
        </div>
        <Link href="/" passHref className="hidden sm:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex flex-col relative">
            <Image
              alt="ETH Latam logo"
              className="cursor-pointer"
              src="/logo_black.svg"
              width="125"
              height="125"
              style={{
                filter: `invert(${isDarkMode ? "0%" : "100%"})`,
              }}
            />
            <div className="font-bold leading-tight text-sm">ETH Latam Faucet</div>
          </div>
        </Link>
      </div> */}
      <div className="navbar-end flex-grow">
        <RainbowKitCustomConnectButton />
      </div>
    </div>
  );
};
