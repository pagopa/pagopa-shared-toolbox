# pagoPA Shared Toolbox

Portale web centralizzato che aggrega i tool interni della piattaforma pagoPA in un'unica interfaccia React.

Disponibile su:
- **DEV:** https://shared.dev.platform.pagopa.it/ui
- **UAT:** https://shared.uat.platform.pagopa.it/ui

- [pagoPA Shared Toolbox](#pagopa-shared-toolbox)
    * [Tool disponibili](#tool-disponibili)
    * [Technology Stack](#technology-stack)
    * [Start Project Locally 🚀](#start-project-locally---)
        + [Prerequisites](#prerequisites)
        + [Run the project](#run-the-project)
    * [Available Scripts](#available-scripts)
    * [API Client generation](#api-client-generation)
    * [Operational Guides](#operational-guides)
    * [Contributors 👥](#contributors-)
        + [Maintainers](#maintainers)

---

## Tool disponibili

| Tool | Descrizione |
|---|---|
| **MOCKER** | Gestione delle mock resources per il servizio [pagopa-mocker](https://github.com/pagopa/pagopa-mocker) |
| **RGP** | Pianificazione rilasci (link a Jira) |
| **Call4Task** | Richiesta di attività (link a Jira) |
| **Planning Poker** | Tool per la stima delle attività in modalità Agile |

Dalla home page sono inoltre accessibili link diretti a **Grafana**, **Kibana** e **Metabase** per i vari ambienti (DEV, UAT, PROD).

---

## Technology Stack

- React 17
- TypeScript
- Material UI (MUI) + @pagopa/mui-italia
- Azure MSAL (autenticazione Azure AD)
- Formik (gestione form)
- Axios (chiamate HTTP)
- CRACO (configurazione webpack)

---

## Start Project Locally 🚀

### Prerequisites

- Node.js
- [yarn](https://classic.yarnpkg.com/en/docs/getting-started)

### Run the project

1. Installa le dipendenze:
   ```bash
   yarn
   ```

2. Avvia in modalità sviluppo (punta ai backend DEV):
   ```bash
   yarn start
   ```
   App disponibile su [http://localhost:3000](http://localhost:3000)

3. Avvia in modalità sviluppo puntando ai backend in locale:
   ```bash
   yarn start:local
   ```
   Richiede un file `.env.local` con le variabili d'ambiente dei backend locali.

---

## Available Scripts

| Script | Descrizione |
|---|---|
| `yarn` | Installa tutte le dipendenze |
| `yarn start` | Avvia in dev mode puntando a DEV |
| `yarn start:local` | Avvia in dev mode puntando ai backend locali |
| `yarn build` | Build di produzione nella cartella `build/` |
| `yarn test` | Esegue i test con coverage (CI) |
| `yarn test:local` | Esegue i test in locale |
| `yarn lint` | Analisi statica del codice (output JSON) |
| `yarn lint:local` | Analisi statica del codice (output console) |
| `yarn generate` | Rigenera i client API da OpenAPI spec |
| `yarn prettify` | Formatta il codice con Prettier |

---

## API Client generation

I client API sono generati automaticamente dagli OpenAPI spec dei backend. Per rigenerarli:

```bash
yarn generate
```

Il comando scarica le spec OpenAPI e genera il codice TypeScript in `src/api/generated/`.

Backend configurati:
- `mocker-config` — [pagopa-mocker-config](https://github.com/pagopa/pagopa-mocker-config)
- `authorizer-config` — pagopa-platform-authorizer-config

---

## Operational Guides

> 📖 **[Guida Operativa — Mocker](docs/GUIDA_OPERATIVA_MOCKER.md)** — Guida all'uso dell'interfaccia web per la gestione delle mock resources, con screenshot e workflow operativi.

---

## Contributors 👥

Made with ❤️ by PagoPa S.p.A.

### Maintainers

See `CODEOWNERS` file