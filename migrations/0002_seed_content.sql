INSERT INTO pathways (id, icon, title, tagline, summary, details, meta, is_recommended, sort_order) VALUES
  ('technology', '⌘', 'Technology', 'Digital skills, data, and AI',
   'Build a foundation in digital skills, data, and AI.',
   'A practical introduction to technology for students who want to understand how digital tools, data, and AI shape the world.',
   '["3 courses","Beginner-friendly"]', 1, 1),
  ('business', '↗', 'Business', 'Entrepreneurship and leadership',
   'Turn ideas into impact through entrepreneurship and leadership.',
   'Explore entrepreneurship, marketing, finance, and leadership through activities that connect classroom ideas to real work.',
   '["2 courses","5 weeks"]', 0, 2),
  ('psychology', '◉', 'Psychology', 'People and well-being',
   'Understand people, behavior, and the science of well-being.',
   'Learn about the history of psychology, neuroscience, and the scientific method while discovering where your curiosity can lead.',
   '["1 course","Self-paced"]', 0, 3);

INSERT INTO resources (id, icon, title, summary, sort_order) VALUES
  ('resume', '▤', 'Resume starter kit', 'Templates and tips for your first resume', 1),
  ('interview', '◌', 'Interview practice', 'Build confidence before the big day', 2),
  ('college', '⌂', 'College planning guide', 'A simple map for your next application', 3),
  ('skills', '✦', 'Skills self-check', 'See what you already bring to the table', 4);

INSERT INTO opportunities (id, pathway_id, type, time_label, title, company, description, source, source_url, meta, is_sample, sort_order) VALUES
  ('server-architect', 'technology', 'Career search', '',
   'Information Technology Server Architect / Cybersecurity', 'LinkedIn',
   'Example search for server architecture and cybersecurity roles.',
   'LinkedIn', 'https://www.linkedin.com/jobs/search/?keywords=server%20architect%20cybersecurity',
   '["External reference","Career search"]', 1, 1),
  ('software-engineer', 'technology', 'Career search', 'LinkedIn',
   'Software Engineer', '',
   'Example search for software engineering roles and entry-level opportunities.',
   'LinkedIn', 'https://www.linkedin.com/jobs/search/?keywords=software%20engineer',
   '["External reference","Career search"]', 1, 2),
  ('it-support', 'technology', 'Career search', '',
   'IT Support Specialist', 'Indeed',
   'Example search for help desk, technical support, and IT support roles.',
   'Indeed', 'https://www.indeed.com/jobs?q=IT+Support+Specialist',
   '["External reference","Career search"]', 1, 3);

INSERT INTO journey_steps (pathway_id, step_order, title, body, action_label, target_type, target_id, scroll_target, is_sample) VALUES
  ('technology', 1, 'Take the course',
   'Start the Technology pathway: three beginner-friendly courses on digital skills, data, and AI.',
   'View course', 'pathway', 'technology', NULL, 0),
  ('technology', 2, 'Build your skills',
   'Try the skills self-check, then use the resume starter kit to show what you can do.',
   'Open self-check', 'resource', 'skills', NULL, 0),
  ('technology', 3, 'Find an internship or job',
   'Look at IT Support Specialist roles, a common first step into technology.',
   'View opportunity', 'opportunity', 'it-support', NULL, 1),
  ('technology', 4, 'Reach out to a mentor',
   'Ask ACDC for guidance on your resume and what to apply for first.',
   'Find support', NULL, NULL, 'support', 0);
