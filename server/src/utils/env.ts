import 'dotenv/config';

export function validateEnv() {
  const ObjectEnvs = [
    'DATABASE_URL',
    'JWT_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'CLIENT_URL',
  ];

  console.log("🔍 Validating Environment Variables...");

  const missingEnvs: string[] = [];

  for (const env of ObjectEnvs) {
    // Check if the variable is missing
    if (!process.env[env] || process.env[env] === '') {
      // Small exception for DATABASE_URL if MONGO_URI is present instead
      if (env === 'DATABASE_URL' && process.env['MONGO_URI']) {
        continue;
      }
      missingEnvs.push(env);
    }
  }

  if (missingEnvs.length > 0) {
    console.error(`❌ CRITICAL ERROR: Missing required environment variables: ${missingEnvs.join(', ')}`);
    console.error("Please ensure these are set in your environment or .env file before starting the app.");
    process.exit(1);
  }

  console.log("✅ Environment Variables Validated Successfully!");
}
