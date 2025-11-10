import {Separator} from "@/src/components/ui/separator";

export function AccountContent() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-lg font-semibold">Account</h1>
            <Separator/>
            <p className="text-sm text-muted-foreground">....</p>
        </div>
    )
}