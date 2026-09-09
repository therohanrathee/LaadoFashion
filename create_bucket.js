require('dotenv').config({ path: '.env.local' });
global.WebSocket = require('ws');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function create() {
  const { data, error } = await supabase.storage.createBucket('catalog', {
    public: true,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    fileSizeLimit: 5242880 // 5MB
  });
  if (error) {
    console.error("Failed to create bucket:", error.message);
  } else {
    console.log("Bucket created successfully!", data);
  }
}
create();
