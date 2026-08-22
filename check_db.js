require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data: users } = await supabase.auth.admin.listUsers();
  console.log('Auth Users:');
  for (const u of users.users) {
    console.log(`- ${u.email} (ID: ${u.id})`);
  }
  
  console.log('\nProfiles:');
  const { data: profiles, error } = await supabase.from('profiles').select('*');
  if (error) console.error(error);
  else console.log(profiles);
}

check();
