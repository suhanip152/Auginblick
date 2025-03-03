import RoomProvider from "@/components/RoomProvider"
import { auth } from "@clerk/nextjs/server"
import React from "react"

function DocLayout({
    children,
    params: {id}
  }: Readonly<{
    children: React.ReactNode,
    params: {
      id: string
    }
  }>) {
    auth().protect()


  return (
    <RoomProvider roomId={id}>{children}</RoomProvider>
  )
}

export default DocLayout
