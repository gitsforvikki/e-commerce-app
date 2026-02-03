"use client";

export default function LoginPage() {
  return (
    <form className="space-y-4">
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Login</button>
    </form>
  );
}
