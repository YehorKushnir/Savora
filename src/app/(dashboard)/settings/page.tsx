import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/components/ui/tabs"
import {ToggleSidebar} from "@/src/components/toggle-sidebar";
import {ToggleTheme} from "@/src/components/toggle-theme";

export default function Settings() {
    return (
        <div className="w-full">
            <Tabs defaultValue="profile">
                <div className="flex gap-6 rounded-lg shadow-sm p-6">
                    <div className="min-w-[180px] p-4">
                        <TabsList className="flex flex-col space-y-2 p-4 rounded-lg h-full">
                            <TabsTrigger value="profile" className="rounded-md p-3 cursor-pointer">Profile</TabsTrigger>
                            <TabsTrigger value="account" className="rounded-md p-3 cursor-pointer">Account</TabsTrigger>
                        </TabsList>
                    </div>
                    <div className="flex-1 rounded-lg shadow-sm p-6">
                        <TabsContent value="profile">
                            <div className="flex gap-4 flex-col">
                                <h1 className="text-lg font-semibold">Profile Settings</h1>
                                <div className="flex gap-3 items-center space-x-2">
                                    <ToggleSidebar/>
                                    <h2 className="text-md">Sidebar/Navbar</h2>
                                </div>
                                <div className="flex gap-3 items-center space-x-2">
                                    <ToggleTheme/>
                                    <h2 className="text-md">Change Theme</h2>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="account">
                            <div className="flex gap-4">
                                <h1 className="text-lg font-semibold">Account Settings</h1>
                            </div>
                        </TabsContent>
                    </div>
                </div>
            </Tabs>
        </div>
    )
}