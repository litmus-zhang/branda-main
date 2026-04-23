const TESTIMONIALS = [
    { name: "John B.", role: "Founder, EcoWear", text: "Branda saved me weeks of planning. I went from idea to full brand strategy in 2 minutes.", initials: "JB", color: "bg-indigo-100 text-indigo-600" },
    { name: "Sarah L.", role: "CEO, TechFlow", text: "The marketing strategy generated was spot on. We launched our campaign the next day.", initials: "SL", color: "bg-emerald-100 text-emerald-600" },
    { name: "Mike T.", role: "Owner, BrewHaven", text: "I didn't know where to start with SOPs. Branda built my entire operations manual.", initials: "MT", color: "bg-amber-100 text-amber-600" },
    { name: "Elena R.", role: "Freelance Designer", text: "The logo concepts gave me a perfect starting point. Incredible AI tool.", initials: "ER", color: "bg-pink-100 text-pink-600" },
    { name: "David K.", role: "Founder, RapidSaaS", text: "It's like having a co-founder who works 24/7. Highly recommended.", initials: "DK", color: "bg-blue-100 text-blue-600" },
];

const PRICING_TIERS = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Perfect for testing your business idea.",
        features: ["Brand Identity Generator", "Logo Concepts & SVG", "Social Media Assets", "Basic Brand Guide"],
        buttonText: "Get Started",
        highlight: false
    },
    {
        name: "Starter",
        price: "$11.99",
        period: "per month",
        description: "For solopreneurs ready to launch.",
        features: ["Everything in Free", "Marketing Strategy", "Content Ideas", "Basic Systems & SOPs", "Email Support"],
        buttonText: "Choose Starter",
        highlight: false
    },
    {
        name: "Growth",
        price: "$24.99",
        period: "per month",
        description: "Scale your operations and sales.",
        features: ["Everything in Starter", "Full CRM & Pipeline", "Advanced Systems", "Integrations", "Priority Support"],
        buttonText: "Choose Growth",
        highlight: true
    },
    {
        name: "Enterprise",
        price: "$59.99",
        period: "per month",
        description: "For agencies and large teams.",
        features: ["Everything in Growth", "Unlimited Workspaces", "Team Collaboration", "White Labeling", "Dedicated Account Manager"],
        buttonText: "Contact Sales",
        highlight: false
    }
];

export { TESTIMONIALS, PRICING_TIERS }