# Chatify Frontend

React frontend for the Chatify chat app, connected to your Express/MongoDB backend.

## Setup

```bash
npm install
npm run dev
```

App runs at: http://localhost:5173

## Backend requirement — add /auth/me route

Add this to your `auth.route.js`:
```js
router.get("/me", ProtectRoute, (req, res) => {
  res.json(req.user);
});
```

And import ProtectRoute in your auth routes file.

## Features
- Login / Signup with JWT auth (cookie-based)
- View all contacts
- Send & receive messages
- Image upload support
- Mobile responsive
- Auto-redirect based on auth state
