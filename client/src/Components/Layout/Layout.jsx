// src/Components/Layout/Layout.jsx
import { SidebarProvider, SidebarTrigger } from "../Ui/sidebar";
import { AppSidebar } from "../Ui/app-sidebar";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col flex-1">
        <header className="p-4 border-b border-gray-200 flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-lg font-bold">Dashboard</h1>
        </header>
        <section className="p-4">{children}</section>
      </main>
    </SidebarProvider>
  );
}
