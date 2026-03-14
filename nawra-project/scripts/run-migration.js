// scripts/run-migration.js
// Run SQL migration against Supabase

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ezaztljpxerpmofxryby.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function runMigration() {
  if (!SERVICE_ROLE_KEY) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is required');
    process.exit(1);
  }

  // Read the migration file
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '002_suppliers.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  console.log('🚀 Running migration 002_suppliers.sql...\n');

  try {
    // Use Supabase REST API to execute SQL
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ query: sql }),
    });

    if (!response.ok) {
      // Try alternative method - direct SQL execution via pg
      console.log('RPC not available, trying alternative method...');

      // Split SQL into statements and execute via Supabase client
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

      // Execute the SQL directly
      const { data, error } = await supabase.rpc('exec_sql', { query: sql });

      if (error) {
        throw error;
      }

      console.log('✅ Migration executed successfully!');
      console.log(data);
    } else {
      const result = await response.json();
      console.log('✅ Migration executed successfully!');
      console.log(result);
    }
  } catch (error) {
    console.error('Migration failed:', error.message);
    console.log('\n📋 Please run this SQL manually in Supabase SQL Editor:');
    console.log('   1. Go to https://supabase.com/dashboard');
    console.log('   2. Select your project');
    console.log('   3. Go to SQL Editor');
    console.log('   4. Paste the content of: supabase/migrations/002_suppliers.sql');
    console.log('   5. Click "Run"');
    process.exit(1);
  }
}

runMigration();
