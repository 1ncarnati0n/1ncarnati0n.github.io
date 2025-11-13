export interface Project {
  id: string;
  image: string;
  title: string;
  width: number;
  category: "professional" | "academic";
  link?: string;
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

