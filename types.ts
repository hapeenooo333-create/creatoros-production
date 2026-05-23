export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
  creditsUsed: number;
  creditsLimit: number;
  isOnboarded?: boolean;
}

export interface AuthResponse {
  user: User | null;
  token?: string;
  error?: string;
}

export interface HistoryItem {
  id: string;
  userId: string;
  title: string;
  prompt: string;
  result: string;
  format: string; // e.g. Blog Post, Social Post, Script
  tone: string;
  category: string;
  createdAt: string;
}

export interface APIStatus {
  name: string;
  status: 'active' | 'inactive' | 'pending';
  description: string;
  type: 'core' | 'external';
}

export interface WorkspaceProject {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
  content: string;
  category: string;
}

export interface AnalyticsData {
  totalGenerated: number;
  activeWorkflows: number;
  tokensConsumed: number;
  planLevel: string;
  history: HistoryItem[];
}

export interface WorkflowConfig {
  topic: string;
  tone: string; // e.g. professional, casual, witty, academic, empathetic, bold
  platform: string; // e.g. Blog, LinkedIn, Twitter, YouTube Script, TikTok Script, Instagram Caption, Email
  length: 'short' | 'medium' | 'long';
  audience: string;
  objective: string; // e.g. Brand Awareness, Lead Generation, Educational, Entertainment
}

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface AutomationTrigger {
  id: string;
  name: string;
  platform: string;
  triggerType: string;
  targetChannel: string;
  isActive: boolean;
}

