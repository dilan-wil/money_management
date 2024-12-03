'use client'
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import * as React from "react"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import ProtectedRoute from "@/components/context/protected-route"
import { useAuth } from "@/components/context/auth-context"
import { NavUser } from "@/components/nav-user"
import { Bell } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [userInfo, setUserInfo] = React.useState<{ name: string, email: string, avatar: string }>({
    name: "Anonymous",
    email: "No email",
    avatar: "default_avatar.png", // Default avatar
  })

  const currentDate = new Date()

  React.useEffect(() => {
    if (!user) {
      console.error("User is not authenticated")
      return
    }
    setUserInfo({
      name: user.displayName || "Anonymous",
      email: user.email || "No email",
      avatar: user.photoURL || "default_avatar.png",
    })
  }, [user])

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex justify-between sticky top-0 z-10 h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            <div className="flex h-16 shrink-0 items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {`${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-2">
              <Bell className="cursor-pointer" size={29} />
              <NavUser user={userInfo} />
            </div>
          </header>
          <div className="p-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
