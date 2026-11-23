# OZONE 5 — Intelligence Redefined

A responsive React + Vite frontend with an Express API starter for AI answers and source-backed web research.

## What's included

- Premium dark navy, champagne-gold visual identity.
- Responsive desktop and mobile dashboard.
- Assistant composer and six workspace modes.
- API endpoint for AI answers.
- Optional Brave Search integration with clickable source references.
- Server-side environment variables; secrets are not exposed in browser code.
- Health endpoint at `/api/health`.

## Requirements

- Node.js 20 or newer
- npm
- An AI provider API key for generated answers
- A Brave Search API key for live web search (optional but needed for source retrieval)

## Run locally

1. Extract this project.
2. Open the `ozone5-website` folder in VS Code.
3. Open the terminal in that folder and run:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env`.
5. Add your API keys to `.env` (keep the file private).
6. Start the development servers:

   ```bash
   npm run dev
   ```

7. Open `http://localhost:5173`.

The frontend calls `/api/ask`; during local development configure a proxy if needed. The easiest option is to add this `server.proxy` entry in `vite.config.js`:

```js
server: {
  port: 5173,
  proxy: { "/api": "http://localhost:8787" }
}
```

## Configure keys

- `OPENAI_API_KEY`: API key for an OpenAI-compatible chat completions endpoint.
- `OPENAI_MODEL`: model name available to your account.
- `OPENAI_BASE_URL`: defaults to `https://api.openai.com/v1`.
- `BRAVE_SEARCH_API_KEY`: Brave Search API key.
- `PORT`: backend port, defaults to `8787`.
- `CLIENT_ORIGIN`: allowed frontend origin for the API.

Never commit `.env`, put API keys in frontend code, or publish keys in screenshots.

## Deploy online

This starter uses a separate frontend and backend, which is straightforward to deploy:

### Backend (Render, Railway, or another Node host)
- Create a new Node web service from this repository.
- Build command: `npm install`
- Start command: `npm start`
- Set `NODE_ENV=production`.
- Add `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_BASE_URL`, `BRAVE_SEARCH_API_KEY`, `CLIENT_ORIGIN`, and `PORT` as environment variables.
- The Express server serves the built `dist` folder in production. To use this single-service option, build the frontend before starting: set the host build command to `npm install && npm run build` and start command to `npm start`.

### Single-service deployment (recommended for first launch)
Deploy the whole repository to a Node host such as Render:
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment: `NODE_ENV=production`
- Set API keys in the host's secret environment-variable settings.
- Set `CLIENT_ORIGIN` to your final website origin.

### Important launch checklist
- Connect real authentication before enabling personal accounts.
- Add database-backed conversation history; the current history is temporary browser state.
- Add rate limiting, abuse prevention, monitoring, privacy policy and terms.
- Configure HTTPS and a custom domain.
- Review provider terms, costs, regional availability and data handling.
- Do not advertise uptime, user counts, verification or paid subscriptions until those systems genuinely exist.

## Current limitations

This is a functional website starter, not a finished commercial service. Login, subscriptions, file uploads, voice, persistent history, and admin tools are visual/product placeholders and need implementation before public launch. Live AI and live web research require valid provider keys and may incur usage costs.
