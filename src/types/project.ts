export interface Project {
  id: string;
  image: string;
  images?: string[]; // 여러 이미지 (캐로셀용)
  title: string;
  width: number;
  category: "professional" | "academic";
  link?: string;
  description?: string;
  completed?: string;
  location?: string;
}

export interface NavigationLink {
  label: string;
  url: string;
}

export interface Navigation {
  title: string;
  links: NavigationLink[];
}

export interface Footer {
  text: string;
}

export interface MockData {
  projects: Project[];
  navigation: Navigation;
  footer: Footer;
}

