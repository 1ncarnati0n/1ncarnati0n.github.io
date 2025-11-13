import type { Footer } from "@/types/project";

interface FooterProps {
  footer: Footer;
}

export default function Footer({ footer }: FooterProps) {
  return (
    <footer className="w-full text-center text-[#999] text-[13px] leading-[15px] font-normal py-8">
      <p>{footer.text}</p>
    </footer>
  );
}

