import Image from "next/image";
import Link from "next/link";
import React from "react";
import logoProx1 from "../public/logoProx1.svg";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import SearchBar from "./SearchBar";

const Header = () => {
  return (
    <div className="border-b">
      <div className="flex flex-col lg:flex-row gap-4 p-4 items-center ">
        <div className="flex items-center justify-between w-full lg:w-auto ">
          <Link href={"/"} className="font-bold shrink-0">
            <Image
              src={logoProx1}
              alt={"logo"}
              width={50}
              height={50}
              className="w-14 lg:w-18"
            />
          </Link>

          <div className="lg:hidden">
            <SignedIn>
              <UserButton />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  asChild
                  className="bg-gray-100 text-gray-800 border border-gray-400 px-3 py-1.5 text-sm hover:bg-gray-300 transition "
                >
                  <span>Sign In</span>
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
        {/* //? Search bar */}
        <div className="w-full lg:max-w-2xl">
          <SearchBar />
        </div>

        {/* //? Desktop */}
        <div className="hidden lg:block ml-auto ">
          <SignedIn>
            <div className="flex items-center gap-4">
              <Link href={"/sell-tickets"}>
                <Button className="bg-blue-600 text-white hover:bg-blue-700 text-sm rounded-lg px-3 py-1.5 transition ">
                  Sell Tickets
                </Button>
              </Link>
              <Link href={"/user-tickets"}>
                <Button className="bg-gray-100 text-gray-800 border border-gray-400 px-3 py-1.5 text-sm hover:bg-gray-300 transition ">
                  My Tickets
                </Button>
              </Link>
              <UserButton />
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button
                asChild
                className="bg-gray-100 text-gray-800 border border-gray-400 px-3 py-1.5 text-sm hover:bg-gray-300 transition "
              >
                <span>Sign In</span>
              </Button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* //? Mobile */}
        <div className="lg:hidden w-full flex justify-center gap-3">
          <SignedIn>
            <Link href={"/sell-tickets"} className="flex-1">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 text-sm rounded-lg px-3 py-1.5 transition w-full ">
                Sell Tickets
              </Button>
            </Link>
            <Link href={"/user-tickets"} className="flex-1">
              <Button className="bg-gray-100 text-gray-800 border border-gray-400 px-3 py-1.5 text-sm hover:bg-gray-300 transition w-full">
                My Tickets
              </Button>
            </Link>
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Header;
