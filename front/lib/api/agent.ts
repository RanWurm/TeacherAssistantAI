import { apiRequest } from './client';

export type AgentAskRequest = { message: string };
export type AgentAskResponse = {
  message: string;
  intent: string;
  confidence: number;
  steps_executed: number;
  tokens: {
    planning: number;
    execution: number;
    synthesis: number;
    total: number;
  };
  session_id: string;
};
export function askAgent(payload: AgentAskRequest) {
  return apiRequest<AgentAskResponse>('/chat', 'POST', payload);
}