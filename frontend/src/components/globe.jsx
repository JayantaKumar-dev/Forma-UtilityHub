import IconCloud from "./ui/icon-cloud";

const slugs = [
  // Core
  "java",
  "springboot",
  "hibernate",
  "mysql",
  "postgresql",
  "mongodb",

  // Frontend
  "html5",
  "css3",
  "javascript",
  "typescript",
  "react",
  "redux",
  "tailwindcss",

  // Microservices
  "nodedotjs",   // (used as placeholder for microservices/server)
  "nginx",       // (API gateway / reverse proxy)
  "graphql",     // alt for service communication
  "docker",
  "kubernetes",

  // Cloud / DevOps
  "amazonaws",
  "git",
  "github",
  "gitlab",
  "jira",
  "jenkins",     // (CI/CD)

  // Tools
  "visualstudiocode",
  "intellijidea",
  "postman",
  "swagger",
  "maven",
  "gradle",

  // Extras (creative / frameworks)
  "figma",
];


function IconCloudDemo() {
  return (
    <div className="relative flex size-full max-w-lg items-center justify-center overflow-hidden rounded-lg  px-20 pb-20 pt-8 bg-transparent">
      <IconCloud iconSlugs={slugs} />
    </div>
  );
}

export default IconCloudDemo;
