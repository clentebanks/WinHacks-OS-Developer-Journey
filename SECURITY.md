# Security Policy

## Supported versions

Security fixes are applied to the latest active development version.

## Reporting

Do not open public issues containing:

- credentials;
- API tokens;
- private URLs;
- customer information;
- production environment details.

Report the issue privately to the repository owner with reproduction steps and potential impact.

## Repository rules

- Never commit `.env` files.
- Use `.env.example` for documented variable names.
- Treat legacy files as untrusted until reviewed.
- Pin and review dependencies before production use.
