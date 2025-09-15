import Header from '@/src/components/header'
export const experimental_ppr = true

export default function RootLayout(
    {
        children,
    }: Readonly<{
        children: React.ReactNode
    }>
) {
    return (
        <>
            <Header/>
            <div className="w-full">
                {children}
            </div>
        </>
    )
}
