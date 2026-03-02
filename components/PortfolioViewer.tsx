import React, { useState, useEffect } from 'react';
import { XIcon } from './Icons';

interface ProfileData {
  name: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  summary: string;
  skills: string[];
  experience: {
    company: string;
    role: string;
    period: string;
    location: string;
    description: string;
  }[];
  projects: {
    id: string;
    name: string;
    description: string;
    imageSeed: string;
  }[];
}

interface PortfolioViewerProps {
  onClose: () => void;
}

export default function PortfolioViewer({ onClose }: PortfolioViewerProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load profile", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="portfolio-overlay">
        <div className="portfolio-content loading">
          <div className="spinner"></div>
          <p>Loading Portfolio...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="portfolio-overlay">
      <div className="portfolio-content">
        <button className="close-btn" onClick={onClose}><XIcon /></button>
        
        <div className="portfolio-header">
          <h1>{profile.name}</h1>
          <h2>{profile.title}</h2>
          <div className="contact-info">
            <span>{profile.location}</span> | 
            <span>{profile.phone}</span> | 
            <a href={`mailto:${profile.email}`}>{profile.email}</a> | 
            <a href={profile.website} target="_blank" rel="noreferrer">{profile.website}</a>
          </div>
        </div>

        <div className="portfolio-section">
          <h3>Summary</h3>
          <p>{profile.summary}</p>
        </div>

        <div className="portfolio-section">
          <h3>Core Skills</h3>
          <ul className="skills-list">
            {profile.skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </div>

        <div className="portfolio-section">
          <h3>Experience</h3>
          {profile.experience.map((exp, i) => (
            <div key={i} className="experience-item">
              <div className="exp-header">
                <h4>{exp.company} - {exp.role}</h4>
                <span className="exp-period">{exp.period} | {exp.location}</span>
              </div>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>

        <div className="portfolio-section">
          <h3>Projects & Ventures</h3>
          <div className="projects-grid">
            {profile.projects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-image">
                  <img 
                    src={`https://picsum.photos/seed/${project.imageSeed}/400/250?blur=2`} 
                    alt={project.name} 
                    referrerPolicy="no-referrer"
                  />
                  <div className="project-title-overlay">
                    <h4>{project.name}</h4>
                  </div>
                </div>
                <div className="project-details">
                  <p>{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
