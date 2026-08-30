#!/usr/bin/env node
/**
 * Runtime install — json mod type has nothing to install.
 *
 * Contract (see docs/mod-repo-guide.md §4):
 * - exit 0 = success/already ready; non-zero = failure (print reason)
 * - ASCII output; idempotent; zero third-party deps
 *
 * For a mod type that needs a runtime, print the platform-specific install
 * command (winget/brew/website) or half-automate via dotnet-install.sh, etc.
 */
console.log("SKIP: no runtime dependencies");
process.exitCode = 0;
