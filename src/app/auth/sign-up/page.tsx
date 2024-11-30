import { SignUpCard } from "@/components/SignUpCard";
import background from "@/images/background1.jpg"
import Image from "next/image";
import "./signup.css"

export default function Page() {
    console.log(background)
    return(
        <div style={{height: "100vh"}} className="flex w-full">
            <div style={{height: "100vh"}} className="w-1/2 md:block">
                <Image
                    src={background}
                    alt="Background"
                    style={{ objectFit: "cover", height: "100vh" }}
                    priority
                />
            </div>            
            <div className="w-1/2 flex flex-col items-center justify-center bg-gray-100 p-8">
                <SignUpCard />
            </div>
        </div>
    )
}