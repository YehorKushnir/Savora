import {ChartNoAxesColumn, Gauge, LayoutDashboard, List, Wallet} from "lucide-react";

export const navigation = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Gauge
    },
    {
        title: "Wallets",
        url: "/wallets",
        icon: Wallet
    },
    {
        title: "Categories",
        url: "/categories",
        icon: LayoutDashboard
    },
    {
        title: "Transactions",
        url: "/transactions",
        icon: List
    },
    {
        title: "Statistics",
        url: "/statistics",
        icon: ChartNoAxesColumn
    }
]