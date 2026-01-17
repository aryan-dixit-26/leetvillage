#!/usr/bin/env node

/**
 * Migration script to add passwords to existing users
 * Sets password = username (hashed) for all users without passwords
 */

const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function addPasswordField() {
  console.log("🔐 Starting password migration...\n");

  try {
    // Get all users
    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("id, username, password");

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Found ${users.length} users\n`);

    // Update each user without a password
    let updated = 0;
    let skipped = 0;

    for (const user of users) {
      // Skip if user already has a password
      if (user.password) {
        console.log(`⏭️  User "${user.username}" already has a password, skipping`);
        skipped++;
        continue;
      }

      // Hash the username as the default password
      const hashedPassword = await hashPassword(user.username);

      const { error: updateError } = await supabase
        .from("users")
        .update({ password: hashedPassword })
        .eq("id", user.id);

      if (updateError) {
        console.error(`❌ Failed to update user "${user.username}":`, updateError);
      } else {
        console.log(`✅ Updated user "${user.username}" with default password`);
        updated++;
      }
    }

    console.log(`\n${"=".repeat(60)}`);
    console.log(`📊 Migration Summary:`);
    console.log(`   ✅ Updated: ${updated} users`);
    console.log(`   ⏭️  Skipped: ${skipped} users (already had passwords)`);
    console.log(`${"=".repeat(60)}`);
    console.log(`\n✅ Migration complete!`);
    console.log(`\n📝 All users can now login with their username as password.`);
    console.log(`   They should change their password after first login.\n`);

  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    process.exit(1);
  }
}

// Run migration
addPasswordField().then(() => process.exit(0));
