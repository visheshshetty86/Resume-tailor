function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-hero-radial">
      <div className="mx-auto flex min-h-screen w-full flex-col">
        {children}
      </div>
    </div>
  );
}

export default AppShell;
