# Security policy

## Supported versions

Security fixes are applied to the latest commit on the default branch (`main` or `master`). Use the newest release or clone when deploying.

## Reporting a vulnerability

This project is a **static front-end** app with no bundled server. Risk is mainly limited to:

- Supply chain / dependency vulnerabilities
- XSS if untrusted content is ever rendered without sanitization (currently user input is shown in forms and print preview in the same origin)

If you discover a security issue:

1. **Do not** open a public issue with exploit details.
2. Open a **private security advisory** on GitHub (if enabled for this repository), or contact the maintainers through a private channel.

Include:

- Description of the issue and impact
- Steps to reproduce (if applicable)
- Affected browser or build, if relevant

We will acknowledge receipt as soon as practical and coordinate a fix and disclosure timeline.

## Out of scope

- Social engineering of users
- Issues that require physical access to the victim’s machine
- Denial of service against a static `dist/` host without a specific flaw in this repo’s code
