"use client";

// Project card component
interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
}

function ProjectCard({ title, description, tags, githubUrl, liveUrl, imageUrl }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-[#b8d0ec] hover:border-[#7092be] transition-all hover:shadow-xl group">
      {/* Project Image/Preview */}
      <div className="h-48 bg-gradient-to-br from-[#dce8f5] to-[#c8bfe7] flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <div className="text-6xl opacity-30">💻</div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span 
              key={index} 
              className="px-2 py-1 text-xs rounded-full bg-[#dce8f5] text-[#2b579a] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Links */}
        <div className="flex gap-3">
          {githubUrl && (
            <a 
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          )}
          {liveUrl && (
            <a 
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#7092be] text-white rounded hover:bg-[#5a7aa6] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// Sample projects data - replace with your actual projects
const projectsData: ProjectCardProps[] = [
  {
    title: "Personal Website",
    description: "A creative personal website inspired by Microsoft Paint, built with Next.js and React. Features interactive drawing canvas, multiple themed pages, and responsive design.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/sanyagarg22/personal-website",
    liveUrl: "#",
  },
  {
    title: "Project Two",
    description: "Add your project description here. Explain what the project does, what technologies you used, and what you learned from building it.",
    tags: ["Python", "Machine Learning", "TensorFlow"],
    githubUrl: "https://github.com/sanyagarg22/project-two",
  },
  {
    title: "Project Three",
    description: "Another awesome project you've worked on. Share the technical challenges you overcame and the impact of the project.",
    tags: ["Java", "Spring Boot", "PostgreSQL"],
    githubUrl: "https://github.com/sanyagarg22/project-three",
    liveUrl: "#",
  },
  {
    title: "Project Four",
    description: "Description of your fourth project. What problem does it solve? What makes it unique or interesting?",
    tags: ["React Native", "Firebase", "Mobile"],
    githubUrl: "https://github.com/sanyagarg22/project-four",
  },
  {
    title: "Project Five",
    description: "Share details about another project. Include any notable features, collaborations, or achievements.",
    tags: ["Node.js", "Express", "MongoDB"],
    githubUrl: "https://github.com/sanyagarg22/project-five",
  },
  {
    title: "Project Six",
    description: "Your sixth project goes here. Don't forget to update the GitHub links and add live demo URLs where applicable!",
    tags: ["C++", "OpenGL", "Graphics"],
    githubUrl: "https://github.com/sanyagarg22/project-six",
  },
];

export function Projects() {
  return (
    <div className="flex-1 bg-[#dce8f5] overflow-auto">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold mb-4" style={{ color: "#7092be" }}>
            my projects
          </h1>
          <p className="text-gray-600 text-xl max-w-3xl">
            A collection of projects I've worked on, from web applications to machine learning experiments. 
            Click on any project to view the code or try a live demo.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>

        {/* Footer section */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            Want to see more? Check out my{" "}
            <a 
              href="https://github.com/sanyagarg22" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#7092be] hover:underline font-medium"
            >
              GitHub profile
            </a>
            {" "}for additional projects and contributions.
          </p>
        </div>
      </div>
    </div>
  );
}

