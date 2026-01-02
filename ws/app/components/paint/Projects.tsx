"use client";

// Project component
interface ProjectProps {
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  year?: string;
}

function ProjectItem({ title, description, tags, githubUrl, liveUrl, year, index }: ProjectProps & { index: number }) {
  return (
    <div className="py-8 border-b border-[#b8d0ec] last:border-b-0 group">
      <div className="flex items-start gap-8">
        {/* Number/Index */}
        <div className="text-4xl font-bold text-gray-300 group-hover:text-[#7092be] transition-colors w-16 flex-shrink-0">
          {String(index + 1).padStart(2, '0')}
        </div>
        
        <div className="flex-1">
          {/* Title and year */}
          <div className="flex items-baseline gap-4 mb-3">
            <h3 className="text-3xl font-bold text-gray-800">{title}</h3>
            {year && <span className="text-sm text-gray-500">{year}</span>}
          </div>
          
          {/* Description */}
          <p className="text-gray-600 mb-4 text-lg leading-relaxed max-w-3xl">{description}</p>
          
          {/* Tags and links on same line */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="text-sm text-gray-600"
                >
                  {tag}
                  {idx < tags.length - 1 && <span className="text-gray-400 mx-1">/</span>}
                </span>
              ))}
            </div>
            
            {/* Links */}
            <div className="flex gap-4 items-center">
              {githubUrl && (
                <a 
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#7092be] transition-colors"
                  title="View on GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              )}
              {liveUrl && (
                <a 
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#7092be] transition-colors underline text-sm"
                >
                  live site
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sample projects data - replace with your actual projects
const projectsData: ProjectProps[] = [
  {
    title: "Personal Website",
    description: "A creative personal website inspired by Microsoft Paint, built with Next.js and React. Features interactive drawing canvas, multiple themed pages, and responsive design.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/sanyagarg22/personal-website",
    liveUrl: "#",
    year: "2026",
  },
  {
    title: "Project Two",
    description: "Add your project description here. Explain what the project does, what technologies you used, and what you learned from building it.",
    tags: ["Python", "Machine Learning", "TensorFlow"],
    githubUrl: "https://github.com/sanyagarg22/project-two",
    year: "2025",
  },
  {
    title: "Project Three",
    description: "Another awesome project you've worked on. Share the technical challenges you overcame and the impact of the project.",
    tags: ["Java", "Spring Boot", "PostgreSQL"],
    githubUrl: "https://github.com/sanyagarg22/project-three",
    liveUrl: "#",
    year: "2025",
  },
  {
    title: "Project Four",
    description: "Description of your fourth project. What problem does it solve? What makes it unique or interesting?",
    tags: ["React Native", "Firebase", "Mobile"],
    githubUrl: "https://github.com/sanyagarg22/project-four",
    year: "2024",
  },
  {
    title: "Project Five",
    description: "Share details about another project. Include any notable features, collaborations, or achievements.",
    tags: ["Node.js", "Express", "MongoDB"],
    githubUrl: "https://github.com/sanyagarg22/project-five",
    year: "2024",
  },
  {
    title: "Project Six",
    description: "Your sixth project goes here. Don't forget to update the GitHub links and add live demo URLs where applicable!",
    tags: ["C++", "OpenGL", "Graphics"],
    githubUrl: "https://github.com/sanyagarg22/project-six",
    year: "2023",
  },
];

export function Projects() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto px-8 py-20">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-6xl font-bold mb-4" style={{ color: "#7092be" }}>
            projects
          </h1>
        </div>

        {/* Projects List */}
        <div>
          {projectsData.map((project, index) => (
            <ProjectItem key={index} {...project} index={index} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-[#b8d0ec]">
          <a 
            href="https://github.com/sanyagarg22" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-[#7092be] transition-colors text-sm inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View all on GitHub →
          </a>
        </div>
      </div>
    </div>
  );
}

