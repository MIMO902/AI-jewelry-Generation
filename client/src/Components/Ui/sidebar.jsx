// src/Components/Ui/sidebar.jsx
export function Sidebar({ children }) {
    return <div className="flex">{children}</div>;
  }
  
  export function SidebarContent({ children }) {
    return <aside className="w-64 border-r p-4">{children}</aside>;
  }
  
  export function SidebarGroup({ children }) {
    return <div className="mb-4">{children}</div>;
  }
  
  export function SidebarGroupLabel({ children }) {
    return <h2 className="text-sm font-bold mb-2">{children}</h2>;
  }
  
  export function SidebarGroupContent({ children }) {
    return <div>{children}</div>;
  }
  
  export function SidebarMenu({ children }) {
    return <ul>{children}</ul>;
  }
  
  export function SidebarMenuItem({ children }) {
    return <li className="mb-2">{children}</li>;
  }
  
  export function SidebarMenuButton({ asChild, children }) {
    return asChild ? children : <button>{children}</button>;
  }
  
  export function SidebarProvider({ children }) {
    return <div className="flex">{children}</div>;
  }
  
  export function SidebarTrigger() {
    return <button className="p-2">☰</button>;
  }
  