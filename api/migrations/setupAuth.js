#!/usr/bin/env node

/**
 * Setup script for authentication system
 * This script:
 * 1. Adds password column to users table if it doesn't exist
 * 2. Runs migration to set default passwords for existing users
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function setupAuth() {
  console.log('🔐 Setting up authentication system...\n');

  try {
    // Step 1: Check if password column exists by trying to select it
    console.log('1️⃣  Checking if password column exists...');
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('password')
      .limit(1);

    if (testError) {
      console.log('⚠️  Password column does not exist.');
      console.log('\n📋 Please run this SQL in your Supabase SQL Editor:');
      console.log('─'.repeat(60));
      console.log(`
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password TEXT;
      `);
      console.log('─'.repeat(60));
      console.log('\n⏸️  After adding the column, run this script again.\n');
      process.exit(1);
    }

    console.log('✅ Password column exists\n');

    // Step 2: Run migration to set default passwords
    console.log('2️⃣  Running migration to set default passwords...');
    
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('id, username, password');

    if (fetchError) {
      throw fetchError;
    }

    console.log(`   Found ${users.length} users\n`);

    // Import the migration function
    const { default: addPasswordField } = await import('./addPasswordField.js');
    await addPasswordField();

    console.log('\n✅ Authentication setup complete!\n');
    console.log('📝 All users can now login with their username as password.');
    console.log('   They can change their password after logging in.\n');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupAuth();
