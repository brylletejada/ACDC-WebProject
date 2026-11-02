-- A step with action_url opens that page in a new tab instead of a popup or scroll.
ALTER TABLE journey_steps ADD COLUMN action_url TEXT;

UPDATE journey_steps
SET action_url = 'https://acdcco.org/signup', target_type = NULL, target_id = NULL
WHERE pathway_id = 'technology' AND step_order = 1;
