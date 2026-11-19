# Task 005 local database proposal

Status: PREPARED FOR APPROVAL; not installed, provisioned or executed. This is an engineering setup proposal, not a production environment or business-policy decision.

Prepared during the Task 005 continuation; environment rechecked 2026-11-17. Neither standard port 5432 nor proposed port 55432 had a listener; no PostgreSQL service or configured `.env` was present. Prisma 7.10.1's installed `migrate diff --help` was inspected; no migration was generated or applied.

The continuation rechecked the machine: no `psql` or Docker command, PostgreSQL/Docker service, listener on port 5432, standard `C:\Program Files\PostgreSQL` installation or project `.env` was found. An existing custom installation may still be supplied by the founder; its location, port and databases must be explicitly confirmed before use. Do not send credentials in chat.

## Proposed native Windows option

Use PostgreSQL **17.12 x64**, matching the existing Compose major version. The [official PostgreSQL Windows page](https://www.postgresql.org/download/windows/) links to EDB's installer and [native binary archives](https://www.enterprisedb.com/download-postgresql-binaries). The binary archive permits an isolated user-local setup without installing Docker/WSL or registering a Windows service. Download and execution still require explicit founder approval under the Task 005 prohibition on installing system tools.

| Item | Proposed concrete scope |
|---|---|
| Binaries | Fresh project `.tools/postgresql-17.12/` directory, already covered by the tools ignore rule; official HTTPS distribution only |
| Data | Fresh `%LOCALAPPDATA%\PlazaHub\PostgreSQL17-task005` cluster; refuse to reuse/overwrite any existing directory |
| Listener | `127.0.0.1:55432` only, after checking the port is free; no public binding or firewall change |
| Lifecycle | Explicit `pg_ctl` start/stop for this new cluster only; hidden helper processes; no persistent Windows service or global PATH edit |
| Authentication | SCRAM-SHA-256 loopback authentication; no `trust` rule; newly generated local credentials stored privately, never printed or committed |
| Databases | New `plazahub_dev` and separate `plazahub_test`; dedicated non-superuser database owners; no production connection |
| Schema | Reviewed identity-only initial migration for the current ten models; no financial/property tables |
| Tests | The existing real PostgreSQL suite, followed by authenticated browser/TOTP rehearsal; preserve all WebKit assertions |

The connection binding and authentication restrictions follow PostgreSQL's [connection settings](https://www.postgresql.org/docs/17/runtime-config-connection.html) and [host authentication rules](https://www.postgresql.org/docs/17/auth-pg-hba-conf.html). Verify archive provenance and available signature/checksum evidence before executing any binary. If required Windows runtimes are missing, stop that installation step for separate approval; do not install OS components implicitly.

## Execution sequence after approval

1. Recheck existing installations, target directories and proposed port. Stop if any existing cluster/data would be affected. An approved existing local PostgreSQL installation can replace the download/provisioning steps.
2. Acquire the official versioned binaries, initialize the fresh local cluster with password authentication, set its loopback-only configuration before starting it, and verify server version/address/port. Check that no existing service is altered.
3. Create the two explicitly approved development/test databases and separate restricted owner roles. Generate credentials for these real local roles; do not reuse the example Compose password. Keep the cluster administration credential separate from app/test connections.
4. Confirm that the target development database is new and empty. Generate the initial identity SQL from the current schema, review every statement, record its review, and only then apply the same migration to the confirmed development and test databases. Prefer a reviewed initial SQL migration plus `prisma migrate deploy` on these fresh databases; this avoids needing a shadow database or granting application roles CREATEDB. Never use reset, truncation or `db push` to force a result.
5. Configure ignored local environment variables with the confirmed URLs. Set `PLAZAHUB_TEST_DB_CONFIRMED=YES` only after confirming that the separate test database is reserved for these tests. Validate/generate the client, verify migration status, then execute the real integration suite. Do not treat schema metadata validation as DB verification.
6. Exercise credential sign-in/sign-out, session expiry/revocation, organization switching, owner/manager separation, invitation recipient checks and TOTP/backup-code behavior. Test fixtures remain synthetic and confined to the test database. A human first-owner account in the development database requires the intended owner's supplied details; no permanent default privileged account is created by this proposal.
7. Rerun relevant lint/type/unit/build/browser checks and update actual evidence. Keep production authentication, public registration, invitation delivery, email recovery and tenant OTP disabled until their separate gates are satisfied.
8. Stop only the task-owned PostgreSQL process when requested or when its temporary verification purpose is complete. Preserve the data directory; deletion/uninstallation is a separate explicit action.

## Authorization needed

Approval must explicitly cover acquiring/executing native PostgreSQL 17.12 tools, initializing the fresh isolated local cluster, creating the named local development/test databases and roles, and applying the reviewed identity-only migration to those new databases. The broad instruction to “continue” does not override the original explicit installation and database-confirmation requirements. No cloud database, production access, repository publication, deployment, OS runtime installation or Task 006 work is included.
