type Client = { name: string; rpm: number; authenticated: boolean; trustScore: number };

function chooseRateBucket(client: Client) {
  return {
    client: client.name,
    bucket: client.authenticated && client.trustScore > 80 ? 'premium' : client.rpm > 120 ? 'abuse-watch' : 'standard',
    action: client.rpm > 120 ? 'tighten-threshold-and-challenge' : 'allow',
  };
}

const results = [
  { name: 'trusted-mobile', rpm: 40, authenticated: true, trustScore: 92 },
  { name: 'anonymous-burst', rpm: 180, authenticated: false, trustScore: 12 },
].map(chooseRateBucket);

console.table(results);
if (results[1].bucket !== 'abuse-watch') throw new Error('Burst traffic should go to abuse watch');
