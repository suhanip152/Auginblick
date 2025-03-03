'use client'

import { MenuIcon } from "lucide-react"
import NewDocumentButton from "./NewDocumentButton"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useCollection } from 'react-firebase-hooks/firestore'
import { useUser } from "@clerk/nextjs"
import { collectionGroup, DocumentData, query, where } from "firebase/firestore"
import { db } from "@/firebase"
import { useEffect, useState } from "react"
import SideBarOption from "./SideBarOption"

interface RoomDocument extends DocumentData {
  createdAt: string;
  role: 'owner' | 'editor';
  roomId: string;
  userId: string;

}

function SideBar() {
  const {user} = useUser() //from clerk
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
  }>({
    owner: [],
    editor: [],
  })

  const [data, loading, error] = useCollection(
    user &&
      //collection group to check if room corresponds to userId - connect entries with index (done in Firestore)
      query(
        collectionGroup(db, 'rooms'),
        where('userId', '==', user.emailAddresses[0].toString())
      )
  )

  useEffect(() => {
    if (!data) return

    const grouped = data.docs.reduce<{ //accumulator function
      owner: RoomDocument[];
      editor: RoomDocument[];
    }>(
      (acc, curr) => {
        const roomData = curr.data() as RoomDocument;

        if (roomData.role === 'owner') {
          acc.owner.push({
            id: curr.id,
            ...roomData,
          });
        } else {
          acc.editor.push({
            id: curr.id,
            ...roomData,
          });
        }

        return acc
      }, {
        owner: [],
        editor: [],
      }
    )

    setGroupedData(grouped)

  }, [data])



  const menuOptions = (
    <>
      <NewDocumentButton/>
      {/* My documents */}
      <div className="flex py-4 flex-col space-y-4 md:max-w-36">
        {groupedData.owner.length === 0 ? (
          <h2 className="text-gray-500 font-semibold text-sm">
            No documents found
          </h2>
          ) : (
            <>
              <h2 className="text-gray-500 font-semibold text-sm">
                My Documents
              </h2>
              {groupedData.owner.map((doc) => (
                // <p key={doc.id}>{doc.roomId}</p>
                <SideBarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`}/>
              ))}
            </>
          )
        }

        {/* Shared with me */}
        {groupedData.editor.length > 0 && (
          <>
            <h2 className="text-gray-500 font-semibold text-sm">
              Shared with me
            </h2>
            {groupedData.editor.map((doc) => (
              <SideBarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
            ))}
          </>
        )}


        {/* List */}

        {/* Shared with me */}
        {/* List */}
      </div>

    </>
  )
  return (
    <div className="p-2 md:p-5 bg-gray-200 relative">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <MenuIcon className=""/>
          </SheetTrigger>
          <SheetContent side='left'>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <div>
                {menuOptions}
              </div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:inline">
        {menuOptions}
      </div>
    </div>
  )
}

export default SideBar
