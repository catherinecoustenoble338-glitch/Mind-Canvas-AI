import { StateCreator } from 'zustand';
import { TeamMember } from '../types';

export interface TeamSlice {
  teamMembers: TeamMember[];
  adminUsers: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id' | 'status'>) => void;
  removeTeamMember: (id: string) => void;
  updateTeamMemberRole: (id: string, role: 'admin' | 'editor' | 'viewer') => void;
  addAdminUser: (user: Omit<TeamMember, 'id' | 'status'>) => void;
  removeAdminUser: (id: string) => void;
  updateAdminUser: (id: string, updates: Partial<TeamMember>) => void;
}

// We use any here to avoid circular dependency with AppState for pushToHistory
export const createTeamSlice: StateCreator<TeamSlice, [], [], TeamSlice> = (set, get: any) => ({
  teamMembers: [
      { id: 'tm1', name: 'Alex Designer', email: 'alex@octoflow.com', role: 'admin', status: 'active' },
      { id: 'tm2', name: 'Sarah PM', email: 'sarah@client.com', role: 'editor', status: 'active' },
      { id: 'tm3', name: 'Mike Dev', email: 'mike@agency.com', role: 'viewer', status: 'invited' },
  ],

  adminUsers: [
      { id: 'u1', name: 'Admin User', email: 'admin@octoflow.com', role: 'admin', status: 'active' },
      { id: 'u2', name: 'John Employee', email: 'john@octoflow.com', role: 'editor', status: 'active' },
      { id: 'u3', name: 'Jane Employee', email: 'jane@octoflow.com', role: 'editor', status: 'active' },
      { id: 'u4', name: 'Guest User', email: 'guest@external.com', role: 'viewer', status: 'active' },
  ],

  addTeamMember: (member) => {
      get().pushToHistory?.(`Added Team Member: ${member.name}`);
      const newMember: TeamMember = {
          ...member,
          id: Math.random().toString(36).substr(2, 9),
          status: 'invited'
      };
      set((state) => ({ teamMembers: [...state.teamMembers, newMember] }));
  },

  removeTeamMember: (id) => {
      get().pushToHistory?.('Removed Team Member');
      set((state) => ({ teamMembers: state.teamMembers.filter(m => m.id !== id) }));
  },

  updateTeamMemberRole: (id, role) => {
      get().pushToHistory?.(`Updated Role: ${role}`);
      set((state) => ({
          teamMembers: state.teamMembers.map(m => 
              m.id === id ? { ...m, role } : m
          )
      }));
  },

  addAdminUser: (user) => {
      get().pushToHistory?.(`Admin: Added User ${user.name}`);
      const newUser: TeamMember = {
          ...user,
          id: Math.random().toString(36).substr(2, 9),
          status: 'active'
      };
      set((state) => ({ adminUsers: [...state.adminUsers, newUser] }));
  },

  removeAdminUser: (id) => {
      get().pushToHistory?.('Admin: Removed User');
      set((state) => ({ adminUsers: state.adminUsers.filter(u => u.id !== id) }));
  },

  updateAdminUser: (id, updates) => {
      get().pushToHistory?.('Admin: Updated User');
      set((state) => ({
          adminUsers: state.adminUsers.map(u => 
              u.id === id ? { ...u, ...updates } : u
          )
      }));
  },
});
