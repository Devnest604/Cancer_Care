import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// Verifies the caller is a signed-in admin before touching Auth/Firestore.
// The client sends its Firebase ID token in the Authorization header.
async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) throw new Error("UNAUTHENTICATED");

  const decoded = await adminAuth.verifyIdToken(token);
  const callerDoc = await adminDb.collection("users").doc(decoded.uid).get();
  if (!callerDoc.exists || callerDoc.data()?.role !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return decoded.uid;
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
  } catch (err) {
    const message = (err as Error).message;
    return NextResponse.json(
      { error: message === "FORBIDDEN" ? "Admins only" : "Not signed in" },
      { status: message === "FORBIDDEN" ? 403 : 401 }
    );
  }

  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "name, email and password are required" },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  try {
    const authUser = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    await adminDb.collection("users").doc(authUser.uid).set({
      name,
      email,
      role: "caretaker",
      watchTimeSeconds: 0,
      createdAt: FieldValue.serverTimestamp(),
      lastWatched: null,
    });

    return NextResponse.json({ id: authUser.uid }, { status: 201 });
  } catch (err: any) {
    const message =
      err?.code === "auth/email-already-exists"
        ? "That email is already registered"
        : "Couldn't create the user";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
