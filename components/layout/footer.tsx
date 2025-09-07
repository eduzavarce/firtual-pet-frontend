import { Github, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t-4 border-border py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-card-foreground font-bold">© 2025 eduzavarce@gmail.com. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a
              href="https://github.com/eduzavarce"
              target="_blank"
              rel="noopener noreferrer"
              className="text-card-foreground hover:text-primary transition-colors"
            >
              <Github size={24} />
            </a>
            <a
              href="https://linkedin.com/in/eduzavarce"
              target="_blank"
              rel="noopener noreferrer"
              className="text-card-foreground hover:text-primary transition-colors"
            >
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
