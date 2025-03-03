"use client";

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import React from "react";

function LiveblocksWrapper({ children }: { children: React.ReactNode }) {
  const publicApiKey = 'pk_dev_ioqsWqUi9orLh1smS1wF_0TKVsx53gwpHoK_-cgQifFf6jwQlLNOffsg_v886ejJ';

  if (!publicApiKey) {
    throw new Error("NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY is not set");
  }

  return (
    <LiveblocksProvider publicApiKey={publicApiKey}>
      <RoomProvider 
        id="my-room"
        initialPresence={{ cursor: null }} // ✅ Fix: Provide required initialPresence
      >
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

export default LiveblocksWrapper;
