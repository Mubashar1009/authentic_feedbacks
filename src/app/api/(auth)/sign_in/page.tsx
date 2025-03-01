
'use client'
import { useSession, signIn, signOut } from "next-auth/react"

const page = () => {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn() } className = "bg-red p-2">Sign in</button>
    </>
  )

}

export default page
