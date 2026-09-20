import { readU32LE } from '@/dumb/bytes'

const RECORD_BYTES = 8

export interface Session {
  /** Graded trials in this session. */
  practiced: number
  /** Unix seconds of the last sync before the session; null = none known. */
  from: number | null
  /** Unix seconds of the first sync at or after the session; null = none yet. */
  to: number | null
}

/**
 * Records: `[practiced u32][syncTs u32]`, oldest first; syncTs 0 = never synced.
 * The device has no clock, so a session is dated only by the syncs around it.
 */
export function parseSessions(bytes: Uint8Array): Session[] {
  const records = Array.from({ length: Math.floor(bytes.length / RECORD_BYTES) }, (_, i) => ({
    practiced: readU32LE(bytes, i * RECORD_BYTES),
    syncTs: readU32LE(bytes, i * RECORD_BYTES + 4),
  }))

  let lastSync: number | null = null
  const sessions: Session[] = records.map(({ practiced, syncTs }) => {
    const session = { practiced, from: lastSync, to: syncTs || null }
    if (syncTs) lastSync = syncTs
    return session
  })

  let nextSync: number | null = null
  for (let i = sessions.length - 1; i >= 0; i--) {
    sessions[i].to ??= nextSync
    nextSync = sessions[i].to
  }
  return sessions
}
