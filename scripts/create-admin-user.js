const admin = require('firebase-admin');
const serviceAccount = require('../service-account-key.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function createAdminUser() {
  try {
    // Create the admin user
    const userRecord = await admin.auth().createUser({
      email: 'admin@admin.com',
      password: 'admin123',
      displayName: 'Admin',
    });

    console.log('Successfully created admin user:', userRecord.uid);

    // Set custom claims to identify admin user
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      admin: true
    });

    console.log('Successfully set admin claims');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
