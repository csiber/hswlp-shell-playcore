import {
  CloudIcon,
  BoltIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  EnvelopeIcon,
  CommandLineIcon,
  SunIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Authentication ready",
    description:
      "Complete authentication system with email/password login, registration, forgot password flow and session management via Lucia Auth.",
    icon: ShieldCheckIcon,
  },
  {
    name: "Database and email",
    description:
      "Drizzle ORM with Cloudflare D1 for the database plus React Email and Resend for beautiful email templates.",
    icon: EnvelopeIcon,
  },
  {
    name: "Modern stack",
    description:
      "Next.js 15 App Router with React Server Components, Server Actions and Edge Runtime for optimal performance.",
    icon: BoltIcon,
  },
  {
    name: "Clean interface",
    description:
      "Responsive interface supporting dark and light modes with Tailwind CSS and Shadcn UI components.",
    icon: SunIcon,
  },
  {
    name: "Edge deployment",
    description:
      "Global deployment with Cloudflare Workers and zero cold starts, leveraging Cloudflare's edge network speed.",
    icon: CloudIcon,
  },
  {
    name: "Developer experience",
    description:
      "GitHub Actions based deployment, detailed documentation and TypeScript for type safety.",
    icon: CommandLineIcon,
  },
  {
    name: "Form handling",
    description:
      "Built-in form validation with Zod and React Hook Form for a smooth user experience.",
    icon: RocketLaunchIcon,
  },
];

export function Features() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
            Ready for production
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need for a SaaS app
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            We provide all the foundations so you can focus on what matters.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                  <feature.icon
                    className="h-5 w-5 flex-none text-indigo-600 dark:text-indigo-400"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
