# Anleitung zum lokalen Build.
Voraussetzung für ein lokales Aufsetzen dieses Projektes ist das mindesten folgende Dinge mit den angegeben Mindestvorraussetzungen auf dem Gerät installiert sind:
- Node.js (18.x) [Installations-Guide](https://nodejs.org/en)
- npm (10.2.3)
- pnpm (8.10.5) [Installations-Guide](https://pnpm.io/installation)
- git (2.x) [Installations-Guide](https://git-scm.com/book/de/v2/Erste-Schritte-Git-installieren)

## Klonen 

Laden Sie sich entweder die Zip-Datei herunter und entpacken diese oder Klonen Sie das Projekt mit dem Befehl `git clone <Projekt URL>`

## Developen

Stellen Sie sicher, dass Sie mit dem Terminal in das Projekt-Verzeichnis navigiert haben 'lokaler/pfad/zum/projekt/Schnatter'.
Installieren Sie mithilfe des Befehls `pnpm install` die benötigten Dependencies.

Dannach können Sie das Projekt mit den folgenden Befehlen starten:

```bash
pnpm run dev

# oder starten Sie den Server und öffnen Sie die Anwendung in einem neuen Browser-Tab
pnpm run dev -- --open
```

## Building

Zum Erstellen einer produktiven Version des Projektes:

```bash
pnpm run build
```

Sie können sich eine Preview der produktiven Version anschauen: `npm run preview`.

> Um Ihre Anwendung bereitzustellen, müssen Sie möglicherweise einen [Adapter](https://kit.svelte.dev/docs/adapters) für Ihre Zielumgebung installieren.
