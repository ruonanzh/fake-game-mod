#!/usr/bin/env node
/**
 * Runtime check — json mod type has no runtime dependencies.
 *
 * Contract (see docs/mod-repo-guide.md §4):
 * - exit 0 = ready; non-zero = missing (print what + how to install)
 * - ASCII output; idempotent; zero third-party deps (Node built-ins only)
 *
 * For a mod type that needs a runtime (e.g. csharp-dll needs dotnet),
 * replace this with a real check: run `dotnet --version`, probe the game
 * install dir via mod-repo.json's steamAppId/installDirHint, etc.
 */
console.log("PASS: no runtime dependencies");
process.exitCode = 0;
