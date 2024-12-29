'use client';
import { AppSidebar } from "@/components/app-sidebar";
import * as React from "react";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ProtectedRoute from "@/components/context/protected-route";
import { useAuth } from "@/components/context/auth-context";
import { NavUser } from "@/components/nav-user";
import { Bell, Search } from "lucide-react";
import { getASubCollection } from "@/functions/get-a-sub-collection";
import { getADocument } from "@/functions/get-a-document";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { SearchCategoryCard } from "@/components/search-category-card";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, income, setIncome, setCategories, setUserInfos, setExpenses } = useAuth();
  const [search, setSearch] = React.useState("");
  const [userInfo, setUserInfo] = React.useState<{ name: string, email: string, avatar: string }>({
    name: "Anonymous",
    email: "No email",
    avatar: "default_avatar.png", // Default avatar
  })
   // This useEffect will fetch and set the expenses as soon as the user is authenticated
   React.useEffect(() => {
    if (!user) {
      console.error("User is not authenticated")
      return
    }

    // Set up real-time listener to fetch income data and update context
    const unsubscribe = getASubCollection("users", user.uid, "expenses", setExpenses)

    // Cleanup listener on component unmount
    return () => unsubscribe && unsubscribe()
  }, [user, setExpenses])

  // This useEffect will fetch and set the income as soon as the user is authenticated
  React.useEffect(() => {
    if (!user) {
      console.error("User is not authenticated")
      return
    }

    // Set up real-time listener to fetch income data and update context
    const unsubscribe = getASubCollection("users", user.uid, "incomes", setIncome)

    // Cleanup listener on component unmount
    return () => unsubscribe && unsubscribe()
  }, [user, setIncome])

  // get the categories
  React.useEffect(() => {
    if (!user) {
      console.error("User is not authenticated")
      return
    }
    const totalIncome = (income && income.length > 0)
        ? income.reduce((sum: number, inc: any) => sum + Number(inc.amount || 0), 0)
        : 100000;

    // Set up real-time listener to fetch income data and update context
    const unsubscribe = getASubCollection("users", user.uid, "categories", setCategories, totalIncome)

    // Cleanup listener on component unmount
    return () => unsubscribe && unsubscribe()
  }, [user, setCategories, income, setIncome])


  // get the userdata
  React.useEffect(() => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    // Get document and set the state
    const unsubscribe = getADocument(user.uid, "users", setUserInfos);

    // Cleanup listener on component unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, setUserInfos]); // Only rerun if 'user' or 'setUserInfos' changes


  // This useEffect will set the user info when the user changes
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

   
  };

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex justify-between sticky top-0 z-10 h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            <div className="flex h-16 shrink-0 items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
            {/* Search Bar */}
            <div className="flex-grow max-w-md mx-4">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search categories..."
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Bell className="cursor-pointer" size={20} />
              <NavUser user={{ name: user?.displayName || "Anonymous", email: user?.email || "No email", avatar: user?.photoURL || "default_avatar.png" }} />
            </div>
          </header>
          <div className="p-8 overflow-x-hidden">
            {search ? (
              <SearchCategoryCard searchWord={search}/>
            ) : (
              children
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
