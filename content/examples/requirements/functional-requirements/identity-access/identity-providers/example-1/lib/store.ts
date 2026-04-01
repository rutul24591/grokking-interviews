export const providers = {
  available: [
    { id: 'local', label: 'Local password', domains: ['personal'] },
    { id: 'workspace-sso', label: 'Workspace SSO', domains: ['acme.com'] },
    { id: 'google', label: 'Google identity', domains: ['gmail.com', 'googlemail.com'] },
  ],
  selected: 'local',
  lastMessage: 'No provider selected yet.',
};
