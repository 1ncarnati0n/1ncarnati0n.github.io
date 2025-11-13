import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageCarousel from "@/components/ImageCarousel";
import Link from "next/link";
import mockData from "../../../../mock.json";
import type { MockData, Project } from "@/types/project";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;
  const data = mockData as MockData;
  const project = data.projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <Link href="/" className="text-[#006553] hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  // images 배열이 있으면 사용, 없으면 단일 이미지로 배열 생성
  const images = project.images && project.images.length > 0
    ? project.images
    : [project.image];

  return (
    <main className="min-h-screen bg-[whitesmoke]">
      <Header navigation={data.navigation} />
      
      <div className="pt-[100px]">
        {/* 프로젝트 정보 */}
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="mb-8">
            <Link
              href="/"
              className="text-black hover:text-[#006553] transition-colors duration-300 inline-flex items-center gap-2 mb-6"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {project.title}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              {project.completed && (
                <div>
                  <span className="font-semibold">Completed:</span> {project.completed}
                </div>
              )}
              {project.location && (
                <div>
                  <span className="font-semibold">Location:</span> {project.location}
                </div>
              )}
              <div>
                <span className="font-semibold">Category:</span>{" "}
                {project.category === "professional" ? "Professional" : "Academic"}
              </div>
            </div>
            
            {project.description && (
              <p className="mt-6 text-gray-700 leading-relaxed">
                {project.description}
              </p>
            )}
          </div>

          {/* 이미지 캐로셀 */}
          <div className="mt-12">
            <ImageCarousel images={images} projectTitle={project.title} />
          </div>
        </div>
      </div>

      <Footer footer={data.footer} />
    </main>
  );
}

