"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/types/project";

interface ProjectGalleryProps {
  projects: Project[];
}

export default function ProjectGallery({ projects }: ProjectGalleryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // 원본 순서 유지: professional 먼저, 그 다음 academic
  const professionalProjects = projects.filter(
    (p) => p.category === "professional"
  );
  const academicProjects = projects.filter((p) => p.category === "academic");

  const ProjectThumb = ({ project }: { project: Project }) => {
    const content = (
      <div
        className="inline-block mx-[7px] mt-[15px] relative overflow-hidden group cursor-pointer"
        style={{ width: `${project.width}px` }}
        onMouseEnter={() => setHoveredId(project.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        <div className="inline">
          <Image
            src={`/${project.image}`}
            alt={project.title || "Project"}
            width={project.width}
            height={400}
            className="w-full h-auto"
            style={{ objectFit: "cover" }}
          />
        </div>
        {project.title && (
          <div
            className={`absolute bottom-0 left-0 w-full bg-[whitesmoke] text-center min-h-[22px] transition-opacity duration-300 ${
              hoveredId === project.id ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="text-[10px] italic font-bold leading-5 tracking-tight">
              {project.title}
            </span>
          </div>
        )}
      </div>
    );

    // 외부 링크가 있으면 외부 링크 사용, 없으면 상세 페이지로 이동
    if (project.link) {
      return (
        <Link
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {content}
        </Link>
      );
    }

    // 상세 페이지로 이동
    return (
      <Link href={`/projects/${project.id}`} className="block">
        {content}
      </Link>
    );
  };

  return (
    <div className="pt-[100px] px-[100px] w-[70%] mx-auto text-center">
      {/* Professional 프로젝트들 (모두 먼저 표시) */}
      {professionalProjects.map((project) => (
        <ProjectThumb key={project.id} project={project} />
      ))}

      {/* Professional Works 라벨 */}
      <br />
      <p className="mx-5 font-bold text-xs italic text-[#999] leading-4">
        <b>Professonal Wroks</b>
      </p>
      <br />

      {/* Academic 프로젝트들 */}
      {academicProjects.map((project) => (
        <ProjectThumb key={project.id} project={project} />
      ))}

      {/* Academic Works 라벨 */}
      <br />
      <p className="mx-5 font-bold text-xs italic text-[#999] leading-4">
        <b>Academic Wroks</b>
      </p>
      <br />

      {/* Back to Top */}
      <div className="w-full mt-[100px] mb-9 text-center font-bold leading-6">
        <a
          href="#top"
          className="text-black hover:text-[#006553] transition-colors duration-300"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Back to Top
        </a>
      </div>
    </div>
  );
}

