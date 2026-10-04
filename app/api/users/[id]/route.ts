import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) throw new Error("UNAUTHENTICATED");

  const decoded = await adminAuth.verifyIdToken(token);
  const callerDoc = await adminDb.collection("users").doc(decoded.uid).get();
  if (!callerDoc.exists || callerDoc.data()?.role !== "admin") {
    throw new Error("FORBIDDEN");
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(req);
  } catch (err) {
    const message = (err as Error).message;
    return NextResponse.json(
      { error: message === "FORBIDDEN" ? "Admins only" : "Not signed in" },
      { status: message === "FORBIDDEN" ? 403 : 401 }
    );
  }

  const { name, email } = await req.json();
  const updates: Record<string, string> = {};
  if (name) updates.name = name;
  if (email) updates.email = email;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  try {
    if (email) {
      await adminAuth.updateUser(params.id, { email, displayName: name });
    } else if (name) {
      await adminAuth.updateUser(params.id, { displayName: name });
    }
    await adminDb.collection("users").doc(params.id).update(updates);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Couldn't update that user" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(req);
  } catch (err) {
    const message = (err as Error).message;
    return NextResponse.json(
      { error: message === "FORBIDDEN" ? "Admins only" : "Not signed in" },
      { status: message === "FORBIDDEN" ? 403 : 401 }
    );
  }

  try {
    await adminAuth.deleteUser(params.id);
    await adminDb.collection("users").doc(params.id).delete();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Couldn't delete that user" },
      { status: 400 }
    );
  }
}
