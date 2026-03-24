export interface UserProfile {
  fullName: string;
  phone: string;
  email: string;
  department: string;
}

/**
 * Đồng bộ thông tin hồ sơ lên Firebase Firestore (REST API).
 * Yêu cầu đặt biến môi trường Expo:
 * - EXPO_PUBLIC_FIREBASE_PROJECT_ID
 * - EXPO_PUBLIC_FIREBASE_API_KEY
 * - EXPO_PUBLIC_FIREBASE_USER_DOC_ID (optional, mặc định "default")
 */
export async function syncProfileToFirebase(profile: UserProfile) {
  const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
  const docId =
    process.env.EXPO_PUBLIC_FIREBASE_USER_DOC_ID ||
    'default';

  if (!projectId || !apiKey) {
    return {
      ok: false,
      skipped: true,
      message:
        'Thiếu cấu hình Firebase env',
    };
  }

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${docId}?key=${apiKey}`;

  const body = {
    fields: {
      fullName: {
        stringValue: profile.fullName,
      },
      phone: {
        stringValue: profile.phone,
      },
      email: {
        stringValue: profile.email,
      },
      department: {
        stringValue: profile.department,
      },
      updatedAt: {
        timestampValue:
          new Date().toISOString(),
      },
    },
  };

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }

  return {
    ok: true,
    skipped: false,
  };
}
