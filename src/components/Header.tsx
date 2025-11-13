import Link from "next/link";
import type { Navigation } from "@/types/project";

interface HeaderProps {
  navigation: Navigation;
}

export default function Header({ navigation }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full h-[100px]">
      <div className="relative w-full h-full">
        {/* Left Navigation */}
        <div className="absolute top-[50px] left-[30px] font-bold text-2xl">
          <div className="space-y-0">
            <p>
              <Link
                href={navigation.links[0].url}
                className="text-black hover:text-[#006553] transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                {navigation.links[0].label}
              </Link>
            </p>
            <p>
              <Link
                href={navigation.links[1].url}
                className="text-black hover:text-[#006553] transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                {navigation.links[1].label}
              </Link>
            </p>
          </div>
        </div>

        {/* Right Title */}
        <div className="absolute top-[60px] right-[40px]">
          <Link
            href="/"
            className="text-[92px] font-bold text-black hover:text-[#006553] transition-colors duration-300"
          >
            {navigation.title}
          </Link>
        </div>
      </div>
    </header>
  );
}

