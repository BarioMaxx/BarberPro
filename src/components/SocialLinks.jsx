import React from 'react';

export default function SocialLinks() {
  return (
    <div className="social-links">
      <a
        href="https://www.instagram.com/_heritage_blade/"
        className="btn-book"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow Heritage Blade on Instagram"
      >
        <span className="icon">📷</span>Follow on Instagram
      </a>
      <a
        href="https://www.instagram.com/_heritage_blade/reels/"
        className="btn-ghost"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Watch Heritage Blade reels on Instagram"
      >
        <span className="icon">🎥</span>Watch Reels
      </a>
    </div>
  );
}
