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
                <Button className="bg-gray-100 text-gray-800 border border-gray-400 px-3 py-1.5 text-sm hover:bg-gray-300 transition ">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
        {/* //? Search bar */}
        <div className="w-full lg:max-w-2xl">
          <SearchBar />
        </div>
      </div>
    </div>
  );
};

export default Header;
