webinstall.dev/faq
webi is an easy-to-remember way to

install things quickly
without being root or Admin
without touching system files or permissions
without looking up docs
Frequently Asked Questions
Why webi?
Why not brew?
Why not Chocolatey?
Why not a Package Manager?
Mother told me not to run with Shell Pipes!
How does webi work?
How do I update my tools?
How do I uninstall webi?
How is webinstall.dev secured?
Why webi?
No muss, no fuss, no dependency, immediate installs from easy-to-remember URLs.

webi’s purpose is to make it easy to install and switch between versions of common tools that

are hand-picked curations of the most valuable tools
have official, pre-compiled, statically-linked or opt-ified packages
(we don’t store our own versions of binaries)
can have multiple versions installed side-by-side
don’t require mucking up system permissions
Also, you don’t have to look up documentation to install or use it. If you know the name of a thing, it’ll install, or it won’t.

Why not brew?
Why not indeed! We use brew. We even made it easier to install:

curl -sS https://webi.sh/brew | sh
webi isn’t a replacement for brew - it doesn’t try to be a package manager at all.

We use webi for the kinds of things that brew isn’t the right fit for - such as quickly installing and switching between versions of node.

Why not choco?
We’ll love to add Chocolatey for Windows 10. Open an issue if you’d like to help.


But seriously, Why not use a package manager?
webi isn’t special for what it does. In fact, it’s remarkably unspecial for what it does. Rather, webi is special for what it doesn’t do:

webi doesn’t modify your system settings
webi doesn’t need root, sudo, or Admin privileges
webi doesn’t need ruby/node/python/C# etc
webi doesn't require special shell functions to switch versions
webi doesn't create conflicts between installed versions (100% isolated, conflict-free)
webi doesn’t bulk update dependencies, or anything
webi doesn’t restrict the number of dev tools you can install simultaneously
webi doesn’t require documentation
So keep your package manager, and use it for the things it does well. Use webi when it helps - or when the alternative hurts.

But my mother always said "Don't run with shell pipes!"
That’s because your mother grew up in a pre-HTTPS era - back when raptors roamed the unix system control rooms and she had to verify the md4 checksums of her linux downloads by hand for fear of plain-text man-in-the-middle attacks performed by rogue routers.

Also, that’s not a question.

In today’s world HTTPS provides both encryption and integrity protection (checksums happen on-the-fly via aes-gcm or similar methods). Likewise, our shell scripts begin and end with { and } and run in strict mode, thus neither can a partially downloaded file be executed, nor could a typo’d variable cause a stray rm -rf to misbehave.

Indeed, many of the most popular projects on the planet, such as brew and rust, provide a curl | sh solution as their official, secure installer.

Therefore, curl x | sh is neither more nor less secure than downloading and running executables from any other source.

That said, trust matters. Don’t use pipe to a shell from insecure sites or authors you don’t trust.

How does webi work?
We hate custom builds, we hate dependencies, and we hate magic...
(haters gonna hate...)

And so we designed webi to work without them.

In short:

webi uses the official releases API of each project to a download URL the official pre-built package is downloaded directly from the author’s release
(these are typically published Github)
webi downloads a tailored script that downloads and unpacks the release
release files are stored in either ~/.local/opt/ or ~/.local/bin, as appropriate
(which are the well-defined, standards-based locations)
switching to previous or new versions is a simple matter of a link or copy
PATH is updated in ~/.config/envman/PATH.env (or the Windows registry)
This means that instead of having to download hundreds of megabytes (or even gigabytes) of tooling that you don’t use, or having complex configurations buried layers deep within those tools, you just get a few kb of remedial shell scripts - not so much as a single awk!

webinstall.dev’s API transforms release APIs into a common format and is queried with a small amount of system information - OS and CPU strings, and which archive types (tar, zip, etc) are supported - to select a compatible release file URL and provide the customized snippets of POSIX shell and PowerShell to unpack and install the package.

If you’d like to see exactly what would run for a given system, you can:

/api/releases/node@stable.sh?os=mac&arch=arm64&libc=libc&formats=tar,zip&limit=1
/api/installers/node@stable.sh?os=mac&arch=arm64&libc=libc&formats=tar,zip
Our goal is that as time goes on and we’re more sure that all of the odd quirks of how people release their dev tools have been properly handled, the shell script that you download will become simpler, use fewer variables, and shrink even further in size.

How do I update my tools? (or switch versions)
webi foobar@tagname
Given that Webi is _not_ a package manager - and generally doing broad-sweeping updates only ends in tears anyway - when you want to update a package, you just run the installer again.

All of these tag formats are valid:
(though not all packages support each type)

webi node
webi node@latest
webi node@lts
webi node@beta
webi node@16
webi node@16.x
webi node@16.13.0
How do I uninstall webi?
rm -rf ~/.local/bin*/webi*
But I assume you mean that you want to uninstall everything you ever installed with webi as well:

rm -rf ~/.local/opt ~/.local/*bin* ~/.config/envman/PATH.env
There are some exceptions. postgres, for example also needs ~/.local/share/postgres. The exceptions are noted in the documentation pages.

Isn’t it nice when it doesn’t hurt?

You’re welcome. :)

How is webinstall.dev secured?
The webinstall.dev servers are secured by key-based authentication. They do not allow password login and do not run other network-enabled services.

The cloud platform account is protected with Multi-Factor Authentication.

The devices that can access those servers and accounts have strong passwords, passphrases, and auto-lock measures.

The source for the install scripts and templating can be found at https://github.com/webinstall/webi-installers

We realize that allowing this domain’s registration to lapse would cause a security risk and so we have it set to auto renew alongside other domains, and we have a backup credit card on the account.

We’re also considering ways to make this service self-sustaining so that it doesn’t become a burden that we find ourselves unable to support, including the use of EthicalAds.io, Carbon Ads, Brave, and/or accounts with paid features, such as white-labeled install urls.

The packages themselves are retrieved directly from the authors' releases. We consider it the authors' responsibility to manage their distribution. We do not audit author/maintainer packages. However, we only pull in packages from projects that we trust, and we suggest that you only install packages from authors you trust.

If you have any security concerns or discover any vulnerability, please contact webi+security@therootcompany.com and/or coolaj86@gmail.com.
