ALTER TABLE verticals ADD COLUMN theme jsonb NOT NULL DEFAULT '{}'::jsonb;
UPDATE verticals SET theme = '{}'::jsonb WHERE theme = '{}'::jsonb;
