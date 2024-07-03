'use server'
//import { useSession, signOut } from "next-auth/react";
import { auth, signOut } from "@/auth";

async function dashboardPage() {

    //let { data: session } = useSession();
    let session = await auth();
    console.log(session);

    return (
        <form
            action={async () => {
                "use server"
                await signOut()
            }}
        >
            <button
                type="submit"
                className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-purple-800 text-white p-3 text-sm font-medium hover:bg-sky-100 hover:text-purple-800 md:flex-none md:justify-start md:px-3"
                title="logout"
            >
                <div className="hidden md:block">{session?.user.email}</div>
            </button>
        </form>
    )
}

export default dashboardPage