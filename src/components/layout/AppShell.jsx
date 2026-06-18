function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-[#0b0d10] text-[#f5f7fa]">
      <div className="mx-auto flex min-h-screen w-full flex-col">
        {children}
      </div>
    </div>
  );
}

export default AppShell;
