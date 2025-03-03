import { Liveblocks } from "@liveblocks/node";

const key = 'sk_dev_eBoAxRlLiF8QetVBsWyU5iVg_pBuaZziYGgrQSPi_PxrjTFzwSGffwBM8a6kDe3O';

if (!key) {
  throw new Error("LIVEBLOCKS_PRIVATE_KEY is not set");
}

const liveblocks = new Liveblocks({
  secret: key,
});

export default liveblocks;
