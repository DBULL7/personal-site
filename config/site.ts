import * as process from "process";

export type SiteConfig = typeof siteConfig

export const siteConfig = {
    name: "DBULL7",
    description:
        "Beautifully designed components built with Radix UI and Tailwind CSS.",
    mainNav: process.env.NODE_ENV === 'production' ? [] : [
        {
            title: "Home",
            href: "/",
        },
        {
            title: "Blog",
            href: "/blog"
        }
    ],
    links: {
        twitter: "https://twitter.com/Devon_Bull",
        github: "https://github.com/DBULL7",
        linkedin: 'https:///www.linkedin.com/in/bulldevon'
    },
}