CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own subscriptions
CREATE POLICY "Users can manage their own push subscriptions" 
ON push_subscriptions 
FOR ALL USING (auth.uid() = user_id);

-- Allow service role to read all subscriptions for sending pushes
CREATE POLICY "Service role can read all subscriptions"
ON push_subscriptions
FOR SELECT USING (true);
