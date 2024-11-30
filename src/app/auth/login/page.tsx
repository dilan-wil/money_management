import { LoginCard } from "@/components/LoginCard";
import background from "@/images/background2.jpg"
import Image from "next/image";
import "@/app/auth/sign-up/signup.css"

export default function Page() {
    console.log(background)
    return(
        <div style={{height: "100vh"}} className="flex w-full">
            <div style={{height: "100vh"}} className="w-1/2 hidden lg:block">
                <Image
                    src={background}
                    alt="Background"
                    style={{ objectFit: "cover", height: "100vh", width: "100%" }}
                    priority
                />
            </div>            
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-gray-100 p-8">
                <LoginCard />
            </div>
        </div>
    )
}