# Nino - Your AI Learning Companion

A beautiful, modern AI chatbot that learns and grows with every conversation. Built with Next.js 16, powered by multiple AI providers, and featuring real-time streaming responses, persistent memory, and a stunning iOS-inspired interface.

## Features

### Core Functionality
- **Real-time Streaming Chat** - Responses stream in real-time for instant feedback
- **Multi-AI Provider Support** - Switch between Gemini, OpenAI, Groq, and GitHub Models
- **Persistent Memory System** - Nino learns facts about you and remembers them across sessions
- **Beautiful UI** - iOS 27 Liquid Glass design with smooth animations

### Advanced Features
- **3D Sentiment-Reactive Orb** - Visual representation that responds to conversation sentiment
- **Voice Input/Output** - Chat with voice using Web Speech API
- **Chat History** - Organize conversations into sessions
- **Settings Panel** - Customize AI provider, voice settings, theme, and more
- **Memory Management** - View, edit, and manage learned facts

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + React 19
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Authentication**: Better Auth with email/password
- **AI**: Vercel AI SDK (multi-provider support)
- **3D Graphics**: React Three Fiber + Three.js
- **Animations**: GSAP + Tailwind CSS
- **Styling**: Tailwind CSS v4 with glass-morphism effects

## Setup Instructions

### 1. Environment Variables

Set up the following environment variables in your project:

```bash
# Database (auto-provisioned by Neon integration)
DATABASE_URL=postgresql://...

# Better Auth Secret (required for sessions)
BETTER_AUTH_SECRET=<your-random-secret>
```

**To generate `BETTER_AUTH_SECRET`:**
```bash
openssl rand -base64 32
```

### 2. Add Environment Variables to Vercel

1. Click **Settings** (⚙️) in the top right of v0
2. Go to **Vars** section
3. Add the variables above
4. Save

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` in your browser.

## Usage

### Creating an Account
1. Click **Sign Up** on the login page
2. Enter your name, email, and password
3. Click **Sign Up**
4. Start chatting with Nino!

### Chat Features
- **Type to Chat**: Send messages directly in the input field
- **Voice Input**: Click the microphone button to speak your message
- **View Sentiment**: Watch the 3D orb change color based on conversation tone
  - Green = Positive sentiment
  - Blue = Neutral sentiment
  - Red = Negative sentiment

### Settings
Click **Settings** in the sidebar to:
- **Switch AI Provider**: Choose your preferred LLM
- **Voice Settings**: Enable/disable voice and select language
- **Theme**: Change appearance (Light/Dark/Auto)
- **View Memories**: See what Nino has learned about you
- **Logout**: Sign out of your account

### Memory System
Nino automatically:
- Extracts important facts from your conversations
- Stores them in the memory database
- Injects them into future conversations for context
- Shows importance ratings for each fact

## Deployment

### Deploy to Vercel

```bash
vercel deploy
```

Or use the **Publish** button in v0's top right.

### Production Checklist

- ✅ Set `DATABASE_URL` and `BETTER_AUTH_SECRET` in Vercel environment variables
- ✅ Ensure Neon database is provisioned and healthy
- ✅ Test authentication flow with a test account
- ✅ Verify all AI providers are accessible
- ✅ Test voice input/output functionality
- ✅ Confirm memory persistence across sessions

## API Endpoints

### Chat
- `POST /api/chat` - Stream AI responses with memory context

### Memory Management
- `GET /api/memories` - Fetch all learned facts
- `POST /api/memories` - Create/update a memory
- `DELETE /api/memories?id=<id>` - Delete a memory

### Settings
- `GET /api/settings` - Fetch user settings
- `POST /api/settings` - Update user settings

### Authentication
- `POST /api/auth/sign-up` - Create account
- `POST /api/auth/sign-in` - Login
- `POST /api/auth/sign-out` - Logout

## File Structure

```
/vercel/share/v0-project/
├── app/
│   ├── page.tsx                 # Main chat page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Design system
│   ├── glass-effects.css        # Glass morphism styles
│   ├── sign-in/page.tsx         # Login page
│   ├── sign-up/page.tsx         # Signup page
│   └── api/
│       ├── chat/route.ts        # Chat streaming endpoint
│       ├── memories/route.ts    # Memory CRUD
│       ├── settings/route.ts    # Settings CRUD
│       ├── auth/[...all]/       # Better Auth handler
│       └── ...
├── components/
│   ├── chat-page.tsx            # Main chat UI
│   ├── orb-visualization.tsx    # 3D sentiment orb
│   ├── voice-input.tsx          # Voice capture
│   ├── settings-modal.tsx       # Settings panel
│   ├── memories-panel.tsx       # Memory viewer
│   └── auth-form.tsx            # Login/signup form
├── lib/
│   ├── auth.ts                  # Better Auth config
│   ├── auth-client.ts           # Auth client
│   ├── db/
│   │   ├── index.ts             # Drizzle + Neon setup
│   │   └── schema.ts            # Database schema
│   ├── ai-provider.ts           # AI model routing
│   ├── memory-service.ts        # Memory extraction
│   ├── text-to-speech.ts        # Voice output
│   └── ...
├── hooks/
│   └── (custom React hooks)
└── public/
    └── icon.svg                 # App icon
```

## Development

### Adding New AI Providers

1. Create a new provider module in `lib/`
2. Export a `getModel()` function
3. Update `lib/ai-provider.ts` to include the new provider
4. Add provider option to settings

### Customizing the UI

- Edit `app/globals.css` for color scheme
- Update `app/glass-effects.css` for glass morphism effects
- Modify component files in `components/` for layout changes

### Database Migrations

Use Neon's SQL interface or the Neon MCP to:
1. Create new tables
2. Add columns to existing tables
3. Manage indexes and constraints

## Troubleshooting

### "Unauthorized" Error on Login
- Ensure `BETTER_AUTH_SECRET` is set correctly
- Check that the database tables are created
- Verify `DATABASE_URL` is correct

### Voice Input Not Working
- Check browser support (Chrome, Edge, Safari on iOS)
- Ensure microphone permission is granted
- Test with a different browser

### Memory Not Persisting
- Check that `memories` table exists in database
- Verify user is authenticated
- Check API response in browser console

### Chat Not Streaming
- Ensure `/api/chat` endpoint is accessible
- Check AI provider API keys are set
- Verify response headers are correct

## Contributing

This is a complete, production-ready chatbot. Feel free to:
- Add more AI providers
- Enhance the memory extraction logic
- Improve the UI/UX
- Add new features

## License

Built by the Nino team. Powered by v0 and modern web technologies.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the code comments
3. Check the console for error messages
4. Test with different browsers/devices
