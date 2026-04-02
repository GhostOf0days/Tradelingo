import { useState, useCallback } from 'react';

interface Block {
  index: number;
  timestamp: string;
  data: string;
  previousHash: string;
  hash: string;
  nonce: number;
}

function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hex}${hex.split('').reverse().join('')}`;
}

function mineBlock(index: number, data: string, previousHash: string): Block {
  let nonce = 0;
  let hash = '';
  const timestamp = new Date().toLocaleTimeString();

  while (true) {
    hash = simpleHash(`${index}${timestamp}${data}${previousHash}${nonce}`);
    if (hash.startsWith('0x00')) break;
    nonce++;
    if (nonce > 10000) break;
  }

  return { index, timestamp, data, previousHash, hash, nonce };
}

const GENESIS_BLOCK: Block = {
  index: 0,
  timestamp: '00:00:00',
  data: 'Genesis Block',
  previousHash: '0x0000000000000000',
  hash: '0x00a1b2c3d4e5f6a7',
  nonce: 0,
};

const SAMPLE_TRANSACTIONS = [
  'Alice → Bob: 2.5 BTC',
  'Charlie → Diana: 0.8 ETH',
  'Eve → Frank: 150 USDC',
  'Grace → Heidi: 1.2 BTC',
  'Ivan → Judy: 5.0 SOL',
  'Karl → Lucy: 0.05 BTC',
  'Mike → Nancy: 3.0 ETH',
];

export default function BlockchainDemo() {
  const [chain, setChain] = useState<Block[]>([GENESIS_BLOCK]);
  const [isMining, setIsMining] = useState(false);
  const [miningProgress, setMiningProgress] = useState(0);
  const [tamperedBlock, setTamperedBlock] = useState<number | null>(null);

  const addBlock = useCallback(async () => {
    setIsMining(true);
    setMiningProgress(0);

    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 30));
      setMiningProgress(i);
    }

    const lastBlock = chain[chain.length - 1];
    const txData = SAMPLE_TRANSACTIONS[chain.length % SAMPLE_TRANSACTIONS.length];
    const newBlock = mineBlock(chain.length, txData, lastBlock.hash);

    setChain(prev => [...prev, newBlock]);
    setIsMining(false);
    setTamperedBlock(null);
  }, [chain]);

  const tamperWithBlock = (index: number) => {
    if (index === 0) return;
    setTamperedBlock(index);
    setChain(prev => prev.map((block, i) => {
      if (i === index) {
        return { ...block, data: 'TAMPERED: Hacker → Hacker: 1000 BTC', hash: simpleHash('tampered' + Math.random()) };
      }
      if (i > index) {
        return { ...block, hash: simpleHash('broken' + i + Math.random()) };
      }
      return block;
    }));
  };

  const resetChain = () => {
    setChain([GENESIS_BLOCK]);
    setTamperedBlock(null);
  };

  return (
    <div style={{ background: '#0a0a0a', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #222' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <span style={{ color: '#888', fontSize: '0.8rem' }}>TRADELINGO SIMULATOR</span>
          <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.1rem', color: 'white' }}>Blockchain Builder</h3>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{ background: tamperedBlock !== null ? '#ef444433' : '#22c55e33', color: tamperedBlock !== null ? '#ef4444' : '#22c55e', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 'bold' }}>
            {tamperedBlock !== null ? '⚠ Chain Broken' : '✓ Chain Valid'}
          </span>
          <span style={{ background: '#6366f133', color: '#6366f1', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 'bold' }}>
            {chain.length} blocks
          </span>
        </div>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0', alignItems: 'center', minWidth: 'max-content' }}>
          {chain.map((block, idx) => {
            const isTampered = tamperedBlock !== null && idx >= tamperedBlock;
            const isGenesis = idx === 0;
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                {idx > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', width: '40px' }}>
                    <div style={{ height: '2px', flex: 1, background: isTampered ? '#ef4444' : '#22c55e' }} />
                    <div style={{ width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: `8px solid ${isTampered ? '#ef4444' : '#22c55e'}` }} />
                  </div>
                )}
                <div style={{
                  background: isTampered ? '#1a0a0a' : '#0f1520',
                  border: `1px solid ${isTampered ? '#ef4444' : isGenesis ? '#eab308' : '#22c55e'}`,
                  borderRadius: '0.75rem', padding: '1rem', minWidth: '200px',
                  boxShadow: `0 0 15px ${isTampered ? 'rgba(239,68,68,0.15)' : isGenesis ? 'rgba(234,179,8,0.1)' : 'rgba(34,197,94,0.1)'}`,
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold', color: isGenesis ? '#eab308' : 'white', fontSize: '0.9rem' }}>
                      Block #{block.index}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#666' }}>{block.timestamp}</span>
                  </div>

                  <div style={{ background: '#0008', borderRadius: '0.375rem', padding: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.125rem' }}>Data</div>
                    <div style={{ fontSize: '0.8rem', color: isTampered ? '#ef4444' : '#a5b4fc', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {block.data}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.25rem', fontSize: '0.7rem' }}>
                    <div>
                      <span style={{ color: '#666' }}>Prev: </span>
                      <span style={{ color: '#888', fontFamily: 'monospace' }}>{block.previousHash.slice(0, 12)}...</span>
                    </div>
                    <div>
                      <span style={{ color: '#666' }}>Hash: </span>
                      <span style={{ color: isTampered ? '#ef4444' : '#22c55e', fontFamily: 'monospace', fontWeight: 'bold' }}>{block.hash.slice(0, 12)}...</span>
                    </div>
                    <div>
                      <span style={{ color: '#666' }}>Nonce: </span>
                      <span style={{ color: '#eab308', fontFamily: 'monospace' }}>{block.nonce}</span>
                    </div>
                  </div>

                  {!isGenesis && tamperedBlock === null && (
                    <button onClick={() => tamperWithBlock(idx)} style={{
                      marginTop: '0.5rem', width: '100%', padding: '0.375rem', background: '#ef444422',
                      border: '1px solid #ef444444', borderRadius: '0.375rem', color: '#ef4444',
                      fontSize: '0.7rem', cursor: 'pointer', fontWeight: 'bold'
                    }}>
                      🔓 Tamper
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isMining && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ color: '#eab308', fontSize: '0.8rem', fontWeight: 'bold' }}>⛏ Mining new block...</span>
            <span style={{ color: '#888', fontSize: '0.8rem' }}>{miningProgress}%</span>
          </div>
          <div style={{ height: '4px', background: '#1a1a2e', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${miningProgress}%`, background: '#eab308', transition: 'width 0.1s' }} />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button onClick={addBlock} disabled={isMining || chain.length >= 6} style={{
          flex: 1, padding: '0.6rem', border: 'none', borderRadius: '0.5rem', cursor: isMining || chain.length >= 6 ? 'not-allowed' : 'pointer',
          background: '#22c55e', color: 'black', fontWeight: 'bold', fontSize: '0.85rem',
          opacity: isMining || chain.length >= 6 ? 0.5 : 1,
        }}>
          ⛏ Mine Block
        </button>
        <button onClick={resetChain} style={{
          padding: '0.6rem 1rem', border: '1px solid #333', borderRadius: '0.5rem', cursor: 'pointer',
          background: 'transparent', color: '#888', fontSize: '0.85rem'
        }}>
          ↺ Reset
        </button>
      </div>

      <p style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.75rem', textAlign: 'center' }}>
        Mine blocks to build the chain. Try tampering with a block to see how the chain breaks — every
        subsequent block becomes invalid because the hashes no longer match.
      </p>
    </div>
  );
}
