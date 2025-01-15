"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  return (
    <nav className="h-20">
      <div>
        <Link href="#">Mystry Messages</Link>
        {session ? (
          <>
            <span>Welcome, {user?.username || user?.email}</span>
            <button onClick={() => signOut()}>Log Out</button>
          </>
        ) : (
          <Link href={"/sign_in"}>
            <Button>Log in</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
