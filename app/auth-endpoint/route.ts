import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    // Authenticate the request
    const { sessionClaims } = await auth().protect();

    // Extract room from user info
    const { room } = await req.json();

    if (!sessionClaims?.email) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }

    // Prepare session for USER and combine it with user info from clerk
    const session = liveblocks.prepareSession(sessionClaims.email, {
      userInfo: {
        name: sessionClaims.fullName ?? "",
        email: sessionClaims.email,
        avatar: sessionClaims.image ?? "",
      }
    });

    // Check if user is in the room and has access to
    const usersInRoom = await adminDb
      .collectionGroup('rooms')
      .where('userId', '==', sessionClaims.email)
      .get();

    // Is the room we are trying to access, present in the list of rooms of the user?
    const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

    if (userInRoom?.exists) {
      session.allow(room, session.FULL_ACCESS);

      const { body, status } = await session.authorize();

      return NextResponse.json(JSON.parse(body), { status });
    } else {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
