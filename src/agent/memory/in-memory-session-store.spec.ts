import { InMemorySessionStore } from './in-memory-session-store';

describe('InMemorySessionStore', () => {
  it('returns an empty history for an unknown session', async () => {
    const store = new InMemorySessionStore();

    expect(await store.getHistory('unknown')).toEqual([]);
  });

  it('appends and accumulates messages per session', async () => {
    const store = new InMemorySessionStore();

    await store.appendMessages('s1', [{ role: 'user', content: 'hi' }]);
    await store.appendMessages('s1', [{ role: 'assistant', content: 'hello' }]);

    expect(await store.getHistory('s1')).toEqual([
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'hello' },
    ]);
  });

  it('keeps sessions isolated from each other', async () => {
    const store = new InMemorySessionStore();

    await store.appendMessages('s1', [{ role: 'user', content: 'a' }]);
    await store.appendMessages('s2', [{ role: 'user', content: 'b' }]);

    expect(await store.getHistory('s1')).toEqual([{ role: 'user', content: 'a' }]);
    expect(await store.getHistory('s2')).toEqual([{ role: 'user', content: 'b' }]);
  });

  it('clears a session history', async () => {
    const store = new InMemorySessionStore();
    await store.appendMessages('s1', [{ role: 'user', content: 'a' }]);

    await store.clear('s1');

    expect(await store.getHistory('s1')).toEqual([]);
  });
});
