import Link from 'next/link'
import { Button } from "@/src/components/ui/button"
import { ArrowRight, BarChart3, Wallet, ShieldCheck, Layers } from "lucide-react"
import { ToggleTheme } from "@/src/components/toggle-theme";
import Image from "next/image";
import { ToggleLanguage } from "@/src/components/toggle-language";
import { useTranslations } from 'next-intl';

export default function Home() {
    const t = useTranslations('HomePage');

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <Image width={28} height={28} src={'/light.svg'} alt={'logo'}/>
                        Savora
                    </div>
                    <div className="flex items-center gap-4">
                        <ToggleLanguage/>
                        <ToggleTheme/>
                        <Link href="/login">
                            <Button variant="ghost">
                                {t('nav.login')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <section className="pt-24 pb-20 px-6">
                <div className="container mx-auto text-center max-w-4xl">
                    <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-sm text-muted-foreground mb-6 backdrop-blur-sm">
                        <span className="mr-2 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-chart-2 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-chart-2"></span>
                        </span>
                        {t('hero.badge')}
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                        {t('hero.title_main')}<br />
                        <span className="text-primary opacity-80">{t('hero.title_sub')}</span>
                    </h1>

                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                        {t('hero.description')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/login">
                            <Button size="lg" className="h-12 px-8 text-base w-full sm:w-auto">
                                {t('hero.start_btn')} <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base w-full sm:w-auto">
                            {t('hero.demo_btn')}
                        </Button>
                    </div>
                </div>

                <div className="mt-20 relative max-w-5xl mx-auto group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-chart-1/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500"></div>

                    <div className="relative rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
                        <div className="h-10 border-b border-border bg-muted/40 flex items-center px-4 space-x-2">
                            <div className="w-3 h-3 rounded-full bg-destructive/60"></div>
                            <div className="w-3 h-3 rounded-full bg-chart-4/60"></div>
                            <div className="w-3 h-3 rounded-full bg-chart-2/60"></div>
                        </div>

                        <Image
                            src="/wallets-light.png"
                            alt={t('hero.img_alt_light')}
                            width={1200}
                            height={800}
                            priority
                            className="w-full h-auto block dark:hidden"
                        />

                        <Image
                            src="/wallets-dark.png"
                            alt={t('hero.img_alt_dark')}
                            width={1200}
                            height={800}
                            priority
                            className="w-full h-auto hidden dark:block dark:opacity-90 dark:brightness-100"
                        />
                        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent"></div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 bg-muted/30 border-t border-border">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 tracking-tight">{t('features.title')}</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {t('features.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

                        <div className="md:col-span-2 bg-card text-card-foreground border border-border rounded-xl p-8 shadow-sm flex flex-col justify-between overflow-hidden relative group">
                            <div className="relative z-10 max-w-md">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                                    <BarChart3 className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-2">{t('features.stats.title')}</h3>
                                <p className="text-muted-foreground">
                                    {t('features.stats.description')}
                                </p>
                            </div>

                            <div className="mt-8 md:absolute md:right-[-10px] md:bottom-[-10px] md:w-3/5 rounded-tl-xl border border-border shadow-lg overflow-hidden transition-transform group-hover:-translate-y-2 group-hover:-translate-x-2 bg-card">
                                <Image
                                    src="/stats-light.png"
                                    alt={t('features.stats.img_alt_light')}
                                    width={800}
                                    height={500}
                                    className="w-full h-auto block dark:hidden"
                                />
                                <Image
                                    src="/stats-dark.png"
                                    alt={t('features.stats.img_alt_dark')}
                                    width={800}
                                    height={500}
                                    className="w-full h-auto hidden dark:block"
                                />
                            </div>
                        </div>

                        <div className="bg-card text-card-foreground border border-border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center text-chart-2 mb-4">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{t('features.wallets.title')}</h3>
                            <p className="text-muted-foreground text-sm">
                                {t('features.wallets.description')}
                            </p>
                        </div>

                        <div className="bg-card text-card-foreground border border-border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center text-chart-4 mb-4">
                                <Layers className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{t('features.categories.title')}</h3>
                            <p className="text-muted-foreground text-sm">
                                {t('features.categories.description')}
                            </p>
                        </div>

                        <div className="md:col-span-2 bg-card text-card-foreground border border-border rounded-xl p-8 shadow-sm flex items-center gap-6">
                            <div className="w-12 h-12 min-w-[48px] bg-chart-5/10 rounded-lg flex items-center justify-center text-chart-5">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-1">{t('features.privacy.title')}</h3>
                                <p className="text-muted-foreground">
                                    {t('features.privacy.description')}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold mb-6">{t('cta.title')}</h2>
                    <div className="flex justify-center gap-4">
                        <Link href="/login">
                            <Button size="lg">{t('cta.btn')}</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="py-8 border-t border-border bg-background text-center text-sm text-muted-foreground">
                <p>{t('footer.copyright')}</p>
            </footer>
        </div>
    )
}