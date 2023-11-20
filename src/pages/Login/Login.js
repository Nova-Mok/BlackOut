import React from "react";
import Logo from "../../assets/attendies.svg"; // Ensure this path is correct
import axios from 'axios';

const handleGoogleLogin = () => {
    window.location.href = 'http://127.0.0.1:5000/login/google';
  };

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-l from-orange-800 via-purple-800 to-yellow-800 to-gray-800">
      <div className="max-w-md w-full bg-white/80 backdrop-filter backdrop-blur-lg rounded-lg border-2 p-6 shadow-lg">
        <div className="text-center">
          <img className="mx-auto h-10 w-auto" src={Logo} alt="Next AI" />
          <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" action="#" method="POST">
          <div className="flex justify-center">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="text-white bg-[#4285F9] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-12 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mb-2"
            >
              <svg
                className="w-4 h-4 mr-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 19"
              >
                <path
                  fillRule="evenodd"
                  d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                  clipRule="evenodd"
                />
              </svg>
              Sign in with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
