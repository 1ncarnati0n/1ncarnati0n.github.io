import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectGallery from "@/components/ProjectGallery";
import mockData from "../../mock.json";
import type { MockData } from "@/types/project";

export default function Home() {
  const data = mockData as MockData;

  return (
    <main className="min-h-screen">
      <div id="top" />
      <Header navigation={data.navigation} />
      <ProjectGallery projects={data.projects} />
      <Footer footer={data.footer} />
    </main>
  );
}

