
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-cyber-dark border-t border-cyber-primary/20 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-cyber-primary" />
              <span className="text-lg font-bold">
                DarkWeb<span className="text-cyber-primary">Shield</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Protecting your digital identity from dark web exposure. Stay safe in the digital world.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-cyber-primary">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-cyber-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-cyber-primary">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-cyber-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-cyber-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/docs" className="text-muted-foreground hover:text-cyber-primary">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/guides" className="text-muted-foreground hover:text-cyber-primary">
                  Security Guides
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-cyber-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-muted-foreground hover:text-cyber-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-cyber-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-muted-foreground hover:text-cyber-primary">
                  Press Kit
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-cyber-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-cyber-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-muted-foreground hover:text-cyber-primary">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/data" className="text-muted-foreground hover:text-cyber-primary">
                  Data Processing
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-cyber-primary/20 text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <p>© {new Date().getFullYear()} DarkWebShield. All rights reserved.</p>
            <p>Protecting digital identities worldwide.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
