import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GITHUB_REPO_URL } from "@/constants";

const faqs = [
  {
    question: "Is this template really free?",
    answer: (
      <>
        Yes, the template is completely free and <a href={GITHUB_REPO_URL} target="_blank">open source</a>! You can use it freely in personal and commercial projects, modify it and distribute it without restrictions.
      </>
    ),
  },
  {
    question: "What features are included?",
    answer: (
      <>
        The template comes with a comprehensive feature set:
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Authentication with email/password and forgot password flow</li>
          <li>Database integration with Drizzle ORM and Cloudflare D1</li>
          <li>Email service powered by React Email and Resend</li>
          <li>Modern UI components from Shadcn UI and Tailwind CSS</li>
          <li>Form validations and error handling</li>
          <li>Dark mode support</li>
          <li>Responsive design</li>
          <li>TypeScript throughout the codebase</li>
          <li>Automated deployments with GitHub Actions</li>
          <li>Captcha integration with Turnstile</li>
          <li>SEO optimization with Next.js</li>
          <li>And many more...</li>
        </ul>
      </>
    ),
  },
  {
    question: "What technologies does it use?",
    answer: (
      <>
        <p>The template uses modern and reliable technologies:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Next.js 15 with App Router and React Server Components</li>
          <li>TypeScript for type safety</li>
          <li>Tailwind CSS and Shadcn UI for styling</li>
          <li>DrizzleORM with Cloudflare D1 for database</li>
          <li>Lucia Auth for authentication</li>
          <li>Cloudflare Workers for serverless deployment</li>
          <li>Cloudflare KV for session storage</li>
          <li>React Email for beautiful email templates</li>
        </ul>
      </>
    ),
  },
  {
    question: "How do I deploy the app?",
    answer: (
      <>
        <p>Deployment is automated via GitHub Actions. You&apos;ll need:</p>
        <ol className="list-decimal pl-6 mt-2 space-y-1">
          <li>Create Cloudflare D1 and KV namespaces</li>
          <li>Set up Resend for email service</li>
          <li>Configure Turnstile for captcha</li>
          <li>Add your Cloudflare API token to GitHub secrets</li>
          <li>Push to the main branch</li>
        </ol>
        <p className="mt-2">The full deployment process is documented in the <a href={`${GITHUB_REPO_URL}/blob/main/README.md`} target="_blank">GitHub repo</a>.</p>
      </>
    ),
  },
  {
    question: "What do I need to get started?",
    answer: (
      <>
        <p>You&apos;ll only need a Cloudflare account (the free tier works), Node.js installed locally and some basic React and TypeScript knowledge. The template comes with detailed documentation.</p>
        <p>For more information see the <a href={`${GITHUB_REPO_URL}/blob/main/README.md`} target="_blank">documentation</a>.</p>
      </>
    ),
  },
  {
    question: "What new features are coming?",
    answer: (
      <>
        <p>Exciting developments are planned:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Multi-language support (i18n)</li>
          <li>Billing and payment processing</li>
          <li>Admin dashboard</li>
          <li>Email verification on sign up</li>
          <li>Notifications system</li>
          <li>Webhooks support</li>
          <li>Team collaboration features</li>
          <li>Real-time updates</li>
          <li>Analytics dashboard</li>
        </ul>
      </>
    ),
  },
  {
    question: "Can I preview the email templates?",
    answer: (
      <>
        Yes! Run <code>pnpm email:dev</code> and open <a href="http://localhost:3001" target="_blank">http://localhost:3001</a> to edit and preview the templates.
      </>
    ),
  },
  {
    question: "How can I customize the template?",
    answer: (
      <>
        <p>Before going live you should:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Update project details in <code>src/constants.ts</code></li>
          <li>Customize the documentation in <code>./cursor-docs</code></li>
          <li>Modify the footer in <code>src/components/footer.tsx</code></li>
          <li>Optionally update the color palette in <code>src/app/globals.css</code></li>
        </ul>
      </>
    ),
  },
  {
    question: "How can I contribute?",
    answer: (
      <>
        Contributions are welcome! Open an issue, send a pull request or help improve the docs on <a href={GITHUB_REPO_URL} target="_blank">GitHub</a>.
      </>
    ),
  },
];

export function FAQ() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10 dark:divide-gray-100/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="w-full mt-10">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="prose dark:prose-invert w-full max-w-none">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
