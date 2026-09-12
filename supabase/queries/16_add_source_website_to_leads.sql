-- Add source_website column to track which brand/website generated the lead
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source_website TEXT DEFAULT 'LaadoFashion';

-- Add a comment explaining what the column is for
COMMENT ON COLUMN leads.source_website IS 'Tracks which website the lead came from (e.g., LaadoFashion, NeedlesAndShears)';
