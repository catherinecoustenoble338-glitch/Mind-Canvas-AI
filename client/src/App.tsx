import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Board from "@/pages/Board";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AdminDashboard from "@/features/admin/AdminDashboard";
import Chats from "@/pages/Chats";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Board}/>
      <Route path="/login" component={Login}/>
      <Route path="/register" component={Register}/>
      <Route path="/admin" component={AdminDashboard}/>
      <Route path="/chats" component={Chats}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
