## Brukerveiledning (fra start til stopp) — Norsk

Denne veiledningen viser trinn for trinn hvordan du kan bruke DashInsight uten teknisk bakgrunn.

1. **Installer nødvendige verktøy**
   - Installer [Docker Desktop](https://www.docker.com/products/docker-desktop).
   - Installer [Node.js](https://nodejs.org/).

2. **Last ned programmet**
   - Gå til prosjektets GitHub-side, klikk **Code → Download ZIP**, og pakk ut mappen.

3. **Forbered miljøet**
   - Åpne et terminal-/kommandovindu.
   - Naviger til mappen du pakket ut, f.eks.:
     ```bash
     cd DashInsight
     ```
   - Kopier eksempelkonfigurasjonen:
     ```bash
     cp .env.example .env
     ```

4. **Start bakgrunnstjenestene**
   - Kjør:
     ```bash
     docker-compose up --build
     ```
   - Vent til terminalen viser at alle tjenester er klare.

5. **Start brukergrensesnittet**
   - Åpne et nytt terminalvindu og skriv:
     ```bash
     cd frontend
     npm install
     npm run dev
     ```
   - Terminalen viser en lenke (vanligvis `http://localhost:5173`).

6. **Bruk DashInsight**
   - Åpne lenken i nettleseren.
   - Last opp en Excel-fil for å få foreslåtte grafer og KPI-er.
   - Gå til AI-analysen, trykk **Generate** for å lage en rapport og **Export to PDF** for å laste den ned.
   - Utforsk **Compare schools** for å sammenligne flere skoler.

7. **Stopp programmet**
   - I frontend-terminalen: trykk `Ctrl+C`.
   - I terminalen med bakgrunnstjenestene: trykk `Ctrl+C` og kjør:
     ```bash
     docker-compose down
     ```
