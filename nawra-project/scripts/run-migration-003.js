// scripts/run-migration-003.js
// Run the sales channels migration

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ezaztljpxerpmofxryby.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function runMigration() {
  if (!SERVICE_ROLE_KEY) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required');
    console.log('Run: set SUPABASE_SERVICE_ROLE_KEY=your-key');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });

  console.log('🚀 Running migration 003_sales_channels.sql...\n');

  // Read migration file
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '003_sales_channels.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  // Split into individual statements
  const statements = sql
    .split(/;\s*$/m)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`Found ${statements.length} SQL statements to execute\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt.substring(0, 60).replace(/\n/g, ' ');

    try {
      // Use rpc to execute raw SQL (if available)
      // Otherwise, we'll use the REST API for specific operations

      // For CREATE TABLE and similar DDL, we need to use the SQL editor API
      // But that's not available via the client SDK

      // Let's try using pg directly if available
      console.log(`[${i + 1}/${statements.length}] ${preview}...`);

      // Skip if it's just a comment block or empty
      if (stmt.startsWith('/*') || stmt.startsWith('COMMENT ON') || stmt.length < 10) {
        console.log('  → Skipped (comment/annotation)');
        continue;
      }

      // For now, we'll just log what would be executed
      // Real execution requires direct Postgres access or Supabase SQL Editor API
      success++;

    } catch (err) {
      console.log(`  ❌ Failed: ${err.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('Migration preview complete.');
  console.log(`Would execute: ${success} statements`);
  console.log('\n⚠️  To actually run this migration:');
  console.log('   1. Go to https://supabase.com/dashboard');
  console.log('   2. Select your project');
  console.log('   3. Go to SQL Editor');
  console.log('   4. Paste the contents of: supabase/migrations/003_sales_channels.sql');
  console.log('   5. Click "Run"');
  console.log('\n   Or use: npx supabase db push (if Supabase CLI is configured)');
}

runMigration().catch(console.error);
