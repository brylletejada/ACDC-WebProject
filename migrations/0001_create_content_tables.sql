-- Content shown on the homepage. Saved items and career-map progress stay in
-- the browser's localStorage until students have accounts.

CREATE TABLE pathways (
  id TEXT PRIMARY KEY,
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  summary TEXT NOT NULL,
  details TEXT NOT NULL,
  meta TEXT NOT NULL DEFAULT '[]', -- JSON array of short labels
  is_recommended INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE resources (
  id TEXT PRIMARY KEY,
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE opportunities (
  id TEXT PRIMARY KEY,
  pathway_id TEXT REFERENCES pathways(id),
  type TEXT NOT NULL,
  time_label TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  source TEXT NOT NULL,
  source_url TEXT NOT NULL,
  meta TEXT NOT NULL DEFAULT '[]', -- JSON array of short labels
  is_sample INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX opportunities_pathway_idx ON opportunities (pathway_id);

-- A step links to a pathway, resource, or opportunity (target_type + target_id),
-- or scrolls to a page section (scroll_target).
CREATE TABLE journey_steps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pathway_id TEXT NOT NULL REFERENCES pathways(id),
  step_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  action_label TEXT NOT NULL,
  target_type TEXT CHECK (target_type IN ('pathway', 'resource', 'opportunity')),
  target_id TEXT,
  scroll_target TEXT,
  is_sample INTEGER NOT NULL DEFAULT 0,
  UNIQUE (pathway_id, step_order)
);
