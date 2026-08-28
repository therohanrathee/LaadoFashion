-- Enable Realtime for the 'orders' and 'bulk_orders' tables
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table bulk_orders;

-- Set replica identity to FULL so that old and new records are sent in UPDATE events
-- This is necessary for the runner to know if the 'runner_id' actually changed in an UPDATE
alter table orders replica identity full;
alter table bulk_orders replica identity full;
