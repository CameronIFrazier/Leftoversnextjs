"use client";
import { ShineBorder } from "./shineborder";
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "@/app/components/ui/resizable-navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function NavbarDemo() {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        if (trimmed.length > 0) {
            router.push(`/search?query=${encodeURIComponent(trimmed)}`);
            setSearchQuery("");
        }
    };

    const navItems = [
        { name: "Home", link: "/" },
        { name: "Features", link: "/FeaturesPage" },
        { name: "Pricing", link: "/pricing" },
        { name: "Contact", link: "/contact" },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="relative w-full z-50">
            <ShineBorder />
            <Navbar>
                <NavBody className="flex items-center justify-between relative z-50">
                    <NavbarLogo />
                    <NavItems items={navItems} />

                    <div className="flex items-center gap-3 relative z-50">
                        <form
                            onSubmit={handleSearch}
                            className="flex items-center border border-gray-600 rounded-xl px-3 bg-black/70 focus-within:border-purple-400 transition-colors duration-200 relative z-50"
                        >
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search users..."
                                className="bg-transparent text-white placeholder-gray-400 px-1 py-1 outline-none w-32 focus:w-48 transition-all duration-200"
                            />
                        </form>

                        <NavbarButton variant="secondary" href="/#login">
                            Login
                        </NavbarButton>
                        <NavbarButton variant="primary" href="/#signup">
                            Sign Up
                        </NavbarButton>
                    </div>
                </NavBody>

                <MobileNav>
                    <MobileNavHeader>
                        <NavbarLogo />
                        <MobileNavToggle
                            isOpen={isMobileMenuOpen}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        />
                    </MobileNavHeader>

                    <MobileNavMenu
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                    >
                        {navItems.map((item, idx) => (
                            <a
                                key={`mobile-link-${idx}`}
                                href={item.link}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="relative text-white font-bold"
                            >
                                <span className="block">{item.name}</span>
                            </a>
                        ))}
                        <div className="flex w-full flex-col gap-4">
                            <NavbarButton
                                href="/#login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                variant="primary"
                                className="w-full"
                            >
                                Login
                            </NavbarButton>
                            <NavbarButton
                                href="/#signup"
                                onClick={() => setIsMobileMenuOpen(false)}
                                variant="primary"
                                className="w-full"
                            >
                                Sign Up
                            </NavbarButton>
                        </div>
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>
        </div>
    );
}
