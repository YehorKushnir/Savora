"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/components/ui/tabs"
import {Switch} from "@/src/components/ui/switch";
import {useNavbar} from "@/src/lib/stores/navbare-store";

export default function Settings() {
    const {navbarState, toggleNavbar} = useNavbar();

    return (
        <div className="w-full">
            <Tabs defaultValue="profile">
                <div className="flex gap-6 bg-white rounded-lg shadow-sm p-6">
                    <div className="min-w-[180px] p-4">
                        <TabsList className="flex flex-col space-y-2 bg-gray-50 p-4 rounded-lg h-full">
                            <TabsTrigger value="profile" className="rounded-md p-3 cursor-pointer">Profile</TabsTrigger>
                            <TabsTrigger value="account" className="rounded-md p-3 cursor-pointer">Account</TabsTrigger>
                        </TabsList>
                    </div>
                    <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
                        <TabsContent value="profile">
                            <div className="flex gap-4 flex-col">
                                <h1 className="text-lg font-semibold">Profile Settings</h1>
                                <div className="flex gap-3 items-center space-x-2">
                                    <Switch checked={navbarState} onCheckedChange={toggleNavbar} id="airplane-mode" className="scale-125" />
                                    <label htmlFor="airplane-mode" className="text-md font-medium leading-none">
                                        Navbare Mode
                                    </label>
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