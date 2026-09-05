import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    // If deployed on Cloud Run, it will automatically use the default service account credentials.
    // For local dev, you might need GOOGLE_APPLICATION_CREDENTIALS set.
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();

/**
 * Validates the Authorization header and returns the authenticated user's UID.
 * Throws an error if invalid or missing.
 */
export async function getVerifiedUid(authHeader: string | null): Promise<string> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized: Missing or invalid token format');
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    throw new Error('Unauthorized: Token verification failed');
  }
}
