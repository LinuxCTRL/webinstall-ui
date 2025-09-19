import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ - WebInstall UI",
  description:
    "Frequently asked questions about WebInstall - the easy way to install development tools without root privileges or system modifications.",
  openGraph: {
    title: "FAQ - WebInstall UI",
    description: "Frequently asked questions about WebInstall",
    type: "website",
    url: "/faq",
  },
  alternates: {
    canonical: "/faq",
  },
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about WebInstall
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">What is WebInstall?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                WebInstall (webi) is an easy-to-remember way to install
                development tools quickly:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Without being root or Admin</li>
                <li>Without touching system files or permissions</li>
                <li>Without looking up documentation</li>
              </ul>
            </CardContent>
          </Card>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="why-webi" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                <h3 className="text-lg font-semibold">Why use WebInstall?</h3>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p>
                  No muss, no fuss, no dependency, immediate installs from
                  easy-to-remember URLs.
                </p>
                <p>
                  WebInstall's purpose is to make it easy to install and switch
                  between versions of common tools that:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Are hand-picked curations of the most valuable tools</li>
                  <li>
                    Have official, pre-compiled, statically-linked or opt-ified
                    packages
                  </li>
                  <li>Can have multiple versions installed side-by-side</li>
                  <li>Don't require mucking up system permissions</li>
                </ul>
                <p>
                  Also, you don't have to look up documentation to install or
                  use it. If you know the name of a thing, it'll install, or it
                  won't.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="vs-brew" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                <h3 className="text-lg font-semibold">Why not use Homebrew?</h3>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p>
                  Why not indeed! We use brew. We even made it easier to
                  install:
                </p>
                <div className="bg-muted p-3 rounded font-mono text-sm">
                  curl -sS https://webi.sh/brew | sh
                </div>
                <p>
                  WebInstall isn't a replacement for brew - it doesn't try to be
                  a package manager at all.
                </p>
                <p>
                  We use WebInstall for the kinds of things that brew isn't the
                  right fit for - such as quickly installing and switching
                  between versions of node.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="vs-package-managers"
              className="border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left">
                <h3 className="text-lg font-semibold">
                  Why not use a package manager?
                </h3>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p>
                  WebInstall isn't special for what it does. In fact, it's
                  remarkably unspecial for what it does. Rather, WebInstall is
                  special for what it doesn't do:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>WebInstall doesn't modify your system settings</li>
                  <li>
                    WebInstall doesn't need root, sudo, or Admin privileges
                  </li>
                  <li>WebInstall doesn't need ruby/node/python/C# etc</li>
                  <li>
                    WebInstall doesn't require special shell functions to switch
                    versions
                  </li>
                  <li>
                    WebInstall doesn't create conflicts between installed
                    versions (100% isolated, conflict-free)
                  </li>
                  <li>
                    WebInstall doesn't bulk update dependencies, or anything
                  </li>
                  <li>
                    WebInstall doesn't restrict the number of dev tools you can
                    install simultaneously
                  </li>
                  <li>WebInstall doesn't require documentation</li>
                </ul>
                <p>
                  So keep your package manager, and use it for the things it
                  does well. Use WebInstall when it helps - or when the
                  alternative hurts.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="security" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                <h3 className="text-lg font-semibold">
                  Is piping to shell secure?
                </h3>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p>
                  In today's world HTTPS provides both encryption and integrity
                  protection (checksums happen on-the-fly via aes-gcm or similar
                  methods). Our shell scripts begin and end with and run in
                  strict mode, thus neither can a partially downloaded file be
                  executed, nor could a typo'd variable cause a stray rm -rf to
                  misbehave.
                </p>
                <p>
                  Indeed, many of the most popular projects on the planet, such
                  as brew and rust, provide a curl | sh solution as their
                  official, secure installer.
                </p>
                <p>
                  Therefore, curl x | sh is neither more nor less secure than
                  downloading and running executables from any other source.
                </p>
                <p>
                  <strong>That said, trust matters.</strong> Don't use pipe to a
                  shell from insecure sites or authors you don't trust.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="how-it-works"
              className="border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left">
                <h3 className="text-lg font-semibold">
                  How does WebInstall work?
                </h3>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p>
                  We hate custom builds, we hate dependencies, and we hate
                  magic... And so we designed WebInstall to work without them.
                </p>
                <p>In short:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    WebInstall uses the official releases API of each project to
                    download the official pre-built package directly from the
                    author's release
                  </li>
                  <li>
                    WebInstall downloads a tailored script that downloads and
                    unpacks the release
                  </li>
                  <li>
                    Release files are stored in either ~/.local/opt/ or
                    ~/.local/bin, as appropriate
                  </li>
                  <li>
                    Switching to previous or new versions is a simple matter of
                    a link or copy
                  </li>
                  <li>
                    PATH is updated in ~/.config/envman/PATH.env (or the Windows
                    registry)
                  </li>
                </ul>
                <p>
                  This means that instead of having to download hundreds of
                  megabytes (or even gigabytes) of tooling that you don't use,
                  you just get a few kb of remedial shell scripts.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="updating" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                <h3 className="text-lg font-semibold">
                  How do I update my tools?
                </h3>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p>
                  Given that WebInstall is <em>not</em> a package manager - and
                  generally doing broad-sweeping updates only ends in tears
                  anyway - when you want to update a package, you just run the
                  installer again.
                </p>
                <div className="bg-muted p-3 rounded font-mono text-sm">
                  webi foobar@tagname
                </div>
                <p>
                  All of these tag formats are valid (though not all packages
                  support each type):
                </p>
                <ul className="list-disc pl-6 space-y-1 font-mono text-sm">
                  <li>webi node</li>
                  <li>webi node@latest</li>
                  <li>webi node@lts</li>
                  <li>webi node@beta</li>
                  <li>webi node@16</li>
                  <li>webi node@16.x</li>
                  <li>webi node@16.13.0</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="uninstall" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                <h3 className="text-lg font-semibold">
                  How do I uninstall WebInstall?
                </h3>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p>To uninstall just WebInstall:</p>
                <div className="bg-muted p-3 rounded font-mono text-sm">
                  rm -rf ~/.local/bin*/webi*
                </div>
                <p>
                  But we assume you mean that you want to uninstall everything
                  you ever installed with WebInstall as well:
                </p>
                <div className="bg-muted p-3 rounded font-mono text-sm">
                  rm -rf ~/.local/opt ~/.local/*bin* ~/.config/envman/PATH.env
                </div>
                <p>
                  There are some exceptions. postgres, for example also needs
                  ~/.local/share/postgres. The exceptions are noted in the
                  documentation pages.
                </p>
                <p>
                  <strong>
                    Isn't it nice when it doesn't hurt? You're welcome. :)
                  </strong>
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="security-measures"
              className="border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left">
                <h3 className="text-lg font-semibold">
                  How is webinstall.dev secured?
                </h3>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    The webinstall.dev servers are secured by key-based
                    authentication
                  </li>
                  <li>
                    They do not allow password login and do not run other
                    network-enabled services
                  </li>
                  <li>
                    The cloud platform account is protected with Multi-Factor
                    Authentication
                  </li>
                  <li>
                    The devices that can access those servers and accounts have
                    strong passwords, passphrases, and auto-lock measures
                  </li>
                  <li>
                    The source for the install scripts and templating can be
                    found at{" "}
                    <a
                      href="https://github.com/webinstall/webi-installers"
                      className="text-primary hover:underline"
                    >
                      https://github.com/webinstall/webi-installers
                    </a>
                  </li>
                </ul>
                <p>
                  The packages themselves are retrieved directly from the
                  authors' releases. We consider it the authors' responsibility
                  to manage their distribution. We do not audit
                  author/maintainer packages. However, we only pull in packages
                  from projects that we trust, and we suggest that you only
                  install packages from authors you trust.
                </p>
                <p>
                  If you have any security concerns or discover any
                  vulnerability, please contact webi+security@therootcompany.com
                  and/or coolaj86@gmail.com.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
