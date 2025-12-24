import { apiRequest } from './client';

export type AgentAskRequest = { message: string };
export type AgentAskResponse = { answer: string };

export function askAgent(payload: AgentAskRequest) {
  return apiRequest<AgentAskResponse>('/agent/ask', 'POST', payload);
}
