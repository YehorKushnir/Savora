import Header from '@/src/components/header'

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
