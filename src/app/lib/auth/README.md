# Authentication & Role Management

This directory contains utilities for managing user authentication and roles in the application.

## User Types

- **Clients**: Restaurant owners who use the digital menu service (stored in `users` table)
- **Admins**: Administrators who manage all clients (stored in `admins` table)

## Usage

### Using the `useAuth` Hook

```tsx
import { useAuth } from "@/app/hooks/useAuth";

function MyComponent() {
  const { user, profile, loading, isAdmin, isClient, role, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

  return (
    <div>
      <p>Email: {user.email}</p>
      <p>Name: {profile?.full_name}</p>
      <p>Role: {role}</p>
      
      {isAdmin && <AdminPanel />}
      {isClient && <ClientDashboard />}
      
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Checking Roles Directly

```tsx
import { isAdmin, isClient, getUserRole } from "@/app/lib/auth/roles";
import { supabase } from "@/app/lib/supabase/client";

async function checkUserRole() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const role = await getUserRole(user.id);
  const admin = await isAdmin(user.id);
  const client = await isClient(user.id);
}
```

### Protecting Routes

```tsx
"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/auth/login");
    }
  }, [isAdmin, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return null;

  return <div>Admin Content</div>;
}
```

## Database Tables

- `auth.users`: Managed by Supabase Auth (automatic)
- `profiles`: General user profile information
- `users`: Client-specific information
- `admins`: Administrator information

## Initial Users

- **Client**: `client@gmail.com` / `27102006`
- **Admin**: `leanmaximsada@gmail.com` / `Max27102006`
