require('dotenv').config({ path: '.env.local' });

async function main() {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/leads?select=*&order=created_at.desc&limit=20`;
  const response = await fetch(url, {
    headers: {
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
    }
  });
  
  if (!response.ok) {
    console.error('Failed', await response.text());
    return;
  }
  
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

main();
