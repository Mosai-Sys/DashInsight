## User Guide (Start to Finish) — English

This guide walks you through using DashInsight step by step without technical knowledge.

1. **Install required tools**
   - Install [Docker Desktop](https://www.docker.com/products/docker-desktop).
   - Install [Node.js](https://nodejs.org/).

2. **Download the program**
   - Go to the project’s GitHub page, click **Code → Download ZIP**, and extract the folder.

3. **Prepare the environment**
   - Open a terminal.
   - Navigate to the extracted folder, e.g.:
     ```bash
     cd DashInsight
     ```
   - Copy the example configuration:
     ```bash
     cp .env.example .env
     ```

4. **Start background services**
   - Run:
     ```bash
     docker-compose up --build
     ```
   - Wait until the terminal shows all services are ready.

5. **Start the user interface**
   - In a new terminal:
     ```bash
     cd frontend
     npm install
     npm run dev
     ```
   - The terminal prints a link (usually `http://localhost:5173`).

6. **Use DashInsight**
   - Open the link in your browser.
   - Upload an Excel file to get suggested charts and KPIs.
   - Open the AI analysis, click **Generate** to create a report, and **Export to PDF** to download it.
   - Explore **Compare schools** to compare multiple schools.

7. **Stop the program**
   - In the frontend terminal: press `Ctrl+C`.
   - In the services terminal: press `Ctrl+C` and run:
     ```bash
     docker-compose down
     ```
