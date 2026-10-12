// Marketing copy for the landing page, kept separate from layout code.
import {
  CircleQuestionMark,
  Download,
  FileText,
  Languages,
  ListTree,
  Search,
  type LucideIcon,
} from "lucide-react";

export const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it Works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
] as const;

export const FEATURES: ReadonlyArray<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    icon: ListTree,
    title: "Smart outlines",
    description: "Get a clean H1–H3 structure for your topic before a single word is written.",
  },
  {
    icon: FileText,
    title: "Full SEO articles",
    description: "Long-form articles that use your keywords naturally — no keyword stuffing.",
  },
  {
    icon: Search,
    title: "Meta title & description",
    description: "Search-ready meta tags within Google's length limits, every time.",
  },
  {
    icon: CircleQuestionMark,
    title: "FAQ section",
    description: "Five relevant questions and answers to win more space in search results.",
  },
  {
    icon: Languages,
    title: "English, Urdu & Roman Urdu",
    description: "Write for your real audience in the language they actually read.",
  },
  {
    icon: Download,
    title: "Edit, copy & download",
    description: "Polish the result in the editor, then copy it or download .md / .docx files.",
  },
];

export const STEPS = [
  {
    title: "Enter your topic",
    description: "Add a main keyword, extra keywords and who you are writing for.",
  },
  {
    title: "Pick tone, length & language",
    description: "Professional or friendly, short or long — English, Urdu or Roman Urdu.",
  },
  {
    title: "Get your article",
    description: "Outline, article, meta tags and FAQ arrive in seconds. Edit and publish.",
  },
] as const;

export const PLANS = [
  {
    name: "Free",
    price: "Rs 0",
    period: "forever",
    description: "Everything you need to start writing.",
    features: [
      "5 articles per day",
      "Outline, article, meta & FAQ",
      "English, Urdu & Roman Urdu",
      "Copy & download (.md / .docx)",
    ],
    cta: "Get Started Free",
    href: "/signup",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "Coming soon",
    period: "",
    description: "For agencies and heavy writers.",
    features: [
      "Higher daily limits",
      "Premium AI models",
      "Saved history & templates",
      "Publish to WordPress",
    ],
    cta: "Join the waitlist",
    href: "/signup",
    highlighted: false,
  },
] as const;

// PLACEHOLDER testimonials for the design. Replace with real customer
// quotes (with their permission) before public launch — see PRD.
export const TESTIMONIALS = [
  {
    quote: "I used to spend a whole day on one blog post. Now I get a solid first draft in minutes.",
    name: "Sample User",
    role: "Online store owner",
  },
  {
    quote: "Roman Urdu support is a game changer for my Instagram audience and blog readers.",
    name: "Sample User",
    role: "Freelance blogger",
  },
  {
    quote: "The meta tags and FAQ alone save me a lot of time on every client article.",
    name: "Sample User",
    role: "SEO freelancer",
  },
] as const;

export const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/#how-it-works", label: "How it Works" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/#testimonials", label: "Testimonials" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Login" },
      { href: "/signup", label: "Sign up" },
    ],
  },
] as const;
