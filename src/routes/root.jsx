import React from "react";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/SideBar";
import { Outlet } from "react-router-dom";



const Root = () => {
  return (
    <div className={`flex min-h-screen w-full flex-col bg-muted/40`}>
      <SideBar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        {/* <NavBar /> */}
        <main className=" px-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Root;
