import Image from "next/image";
import Link from "next/link";
import { LuFacebook, LuInstagram } from "react-icons/lu";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F8F6F2] py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-start gap-8">

        {/* Logo y redes */}
        <div className="flex flex-col items-start gap-4">
          <Image
            src="/logoduddaloo.svg"
            alt="affars logo"
            width={80}
            height={80}
            priority
          />

          {/* Iconos sociales */}
          <div className="flex gap-4 mt-2">
            <Link href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <LuFacebook className="w-6 h-6 text-gray-400 hover:text-blue-600 transition" />
            </Link>
            <Link href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <LuInstagram className="w-6 h-6 text-gray-400 hover:text-pink-500 transition" />
            </Link>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg mb-2">Company</h3>
          <Link className="text-gray-400" href="/">Home</Link>
          <Link className="text-gray-400"href="/shop">Shop</Link>
          <Link className="text-gray-400" href="/about">About</Link>
          <Link className="text-gray-400" href="/contact">Contact</Link>
        </div>
        {/* Links */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg mb-2">Company</h3>
          <Link className="text-gray-400" href="/">Home</Link>
          <Link className="text-gray-400"href="/shop">Shop</Link>
          <Link className="text-gray-400" href="/about">About</Link>
          <Link className="text-gray-400" href="/contact">Contact</Link>
        </div>

      </div>

      <hr className="border-gray-300 mt-8" />

      {/* Copyright */}
      <div className="text-center mt-4">
        <p className="text-gray-400">
          &copy; {currentYear} Duddaloo. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
