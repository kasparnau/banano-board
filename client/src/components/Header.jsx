import { BriefcaseIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useRef, useState } from "react";
import { Link, Navigate, redirect } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";

import Auth from "api/Auth";
import { useMainStore } from "stores";

const UserDropdown = ({ username }) => {
  return (
    <div className="w-56 text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 hover:text-amber-600">
            {username}
            <ChevronDownIcon
              className="ml-2 -mr-1 h-5 w-5 "
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <a
                    className={`${
                      active ? "bg-amber-600 text-white" : "text-black"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2`}
                    href="/account"
                  >
                    <AccountIcon
                      className="mr-2 h-5 w-5 text-violet-400"
                      aria-hidden="true"
                    />
                    Account
                  </a>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <a
                    className={`${
                      active ? "bg-amber-600 text-white" : "text-black"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2`}
                    href="/my-tasks"
                  >
                    <BriefcaseIcon className="h-5 w-5" aria-hidden="true" />
                    My Tasks
                  </a>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-amber-600 text-white" : "text-black"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2`}
                    onClick={async () => {
                      await Auth.logout();
                      // refresh page hacky method
                      window.location = window.location.href.split("?")[0];
                    }}
                  >
                    <LogoutIcon
                      className="mr-2 h-5 w-5 text-violet-400"
                      aria-hidden="true"
                    />
                    Log Out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

function LogoutIcon(props) {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      ></path>
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg
      className="w-5 h-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

const LoginButton = () => {
  return (
    <Link
      to="login"
      className="px-4 py-2 rounded-md text-sm border hover:bg-gray transition-colors"
    >
      Login
    </Link>
  );
};

export default () => {
  const { user } = useMainStore();
  return (
    <div className="h-14 w-full border-b flex justify-center items-center">
      <div className="max-w-6xl p-8 w-full justify-between items-center flex">
        <a href="/" className="font-bold text-center hover:text-amber-600">
          Banano Board
        </a>
        <div>
          {user ? <UserDropdown username={user.username} /> : <LoginButton />}
        </div>
      </div>
    </div>
  );
};
