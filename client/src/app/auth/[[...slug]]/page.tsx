"use client";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import React, { useState } from "react";
import config from "@/constants/config";
import Image from "next/image";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const BACKEND = config.server;

type Props = {
  params: {
    slug: string;
  };
};

interface submitData {
  target: {
    name: { value: string };
    email: { value: string };
    password: { value: string };
  };
}

const Auth = ({ params }: Props) => {
  const [errorText, setErrorText] = useState("");
  const [showPassword, setshowPassword] = useState(false);
  const router = useRouter();

  const page: string = params?.slug ? params.slug[0] : "signup";
  if (page !== "login" && page !== "signup") {
    return notFound();
  }

  const handleSignup = async (
    e: React.FormEvent<HTMLFormElement> & submitData
  ) => {
    e.preventDefault();
    try {
      const name = e.target.name.value;
      const email = e.target.email.value;
      const password = e.target.password.value;
      if (name.length < 0 || email.length < 0 || password.length < 0) {
        setErrorText("All fields not provided");
        return;
      }
      const res = await fetch(`${BACKEND}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      console.log("done");
      console.log(res.ok);
      const data = await res.json();
      if (res.ok) {
        console.log("User created successfully");
        const token = data.token;
        localStorage.setItem("token", token);
        router.push("/update-details");
      } else {
        setErrorText(data?.message);
      }
    } catch (error) {
      console.log(error);
      setErrorText("Interal server error");
    }
  };

  const handlelogin = async (
    e: React.FormEvent<HTMLFormElement> & submitData
  ) => {
    try {
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;
      if (email.length < 0 || password.length < 0) {
        setErrorText("All fields not provided");
        return;
      }
      const res = await fetch(`${BACKEND}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log("User logged successfully");
        const token = data.token;
        if (!token) throw new Error("Internal server error");
        localStorage.setItem("token", token);
        router.push("/chat");
      } else {
        setErrorText(data?.message);
      }
    } catch (error) {
      console.log(error);
      setErrorText("Interal server error");
    }
  };

  const handleShowPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setshowPassword((prev) => !prev);
  };

  return (
    <div className="flex md:flex-row flex-col justify-center items-center p-10 rounded-md w-full h-screen">
      <div className="flex w-72 sm:w-96 md:w-full h-72 sm:h-96 md:h-full">
        <Image
          src={"/svgs/authimg.jpg"}
          alt="Auth background"
          width={2000}
          height={1400}
          className="md:object-cover"
        />
      </div>
      <div className="flex flex-col md:justify-center items-center w-full h-full">
        {page == "login" ? (
          <form
            onSubmit={handlelogin}
            className="flex flex-col gap-4 px-4 py-2 w-full max-w-[400px]"
          >
            <h1>Login</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              className="border-gray-500 p-2 border"
            />
            <div className="flex flex-row items-center border-gray-500 border focus:outline">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                className="p-2 border-none w-full outline-none"
              />
              <button onClick={handleShowPassword} className="p-2">
                {showPassword ? (
                  <EyeOffIcon strokeWidth={1.5} />
                ) : (
                  <EyeIcon strokeWidth={1.5} />
                )}
              </button>
            </div>
            <button type="submit" className="bg-blue-500 p-2 text-white">
              Login
            </button>
            <p>
              Dont have an account?{" "}
              <Link
                href={"/auth/signup"}
                className="font-semibold text-blue-500"
              >
                Signup
              </Link>
            </p>
            {errorText?.length > 0 && (
              <p className="text-red-400">{errorText}</p>
            )}
          </form>
        ) : (
          <form
            onSubmit={handleSignup}
            className="flex flex-col gap-4 px-4 py-2 w-full max-w-[400px]"
          >
            <h1>Signup</h1>
            <input
              type="text"
              placeholder="Name"
              name="name"
              className="border-gray-500 p-2 border outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              className="border-gray-500 p-2 border outline-none"
            />
            <div className="flex flex-row items-center border-gray-500 border focus:outline">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                className="p-2 border-none w-full outline-none"
              />
              <button onClick={handleShowPassword} className="p-2">
                {showPassword ? (
                  <EyeOffIcon strokeWidth={1.5} />
                ) : (
                  <EyeIcon strokeWidth={1.5} />
                )}
              </button>
            </div>
            <button
              type="submit"
              className="bg-blue-500 p-2 rounded-md text-white"
            >
              Signup
            </button>
            <p>
              Have an account?{" "}
              <Link
                href={"/auth/login"}
                className="font-semibold text-blue-500"
              >
                Login
              </Link>
            </p>
            {errorText?.length > 0 && (
              <p className="text-red-400">{errorText}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
