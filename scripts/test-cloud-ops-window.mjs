/**
 * Unit tests for Cloudflare 30′ pre-KO → FT+30′ window (src/lib/data.js).
 * Run: node scripts/test-cloud-ops-window.mjs
 */
import {
  CLOUD_AFTER_FT_MIN,
  CLOUD_BEFORE_MIN,
  CLOUD_MAX_AFTER_KO_MIN,
  ESTIMATED_FT_AFTER_KO_MIN,
  anyCloudOpsActivity,
  inCloudOpsWindow,
  isSchedulableFixture,
} from '../src/lib/data.js'

let failed = 0
function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL:', msg)
    failed++
  } else {
    console.log('ok —', msg)
  }
}

const ko = Date.parse('2026-08-11T17:30:00Z')
const fixture = { id: 't1', kickoff: '2026-08-11T17:30:00Z', home: 'OLY', away: 'NEC' }

assert(CLOUD_BEFORE_MIN === 30, 'CLOUD_BEFORE_MIN = 30')
assert(CLOUD_AFTER_FT_MIN === 30, 'CLOUD_AFTER_FT_MIN = 30')
assert(ESTIMATED_FT_AFTER_KO_MIN === 100, 'ESTIMATED_FT_AFTER_KO_MIN = 100')
assert(CLOUD_MAX_AFTER_KO_MIN === 180, 'CLOUD_MAX_AFTER_KO_MIN = 180')

assert(!inCloudOpsWindow(fixture.kickoff, ko - 31 * 60000), 'inactive 31′ before KO')
assert(inCloudOpsWindow(fixture.kickoff, ko - 30 * 60000), 'active at 30′ before KO')
assert(inCloudOpsWindow(fixture.kickoff, ko + 45 * 60000), 'active mid-match')

const ft = ko + 95 * 60000
assert(inCloudOpsWindow(fixture.kickoff, ft + 29 * 60000, ft), 'active FT+29′')
assert(!inCloudOpsWindow(fixture.kickoff, ft + 31 * 60000, ft), 'inactive FT+31′')

assert(
  inCloudOpsWindow(fixture.kickoff, ko + 130 * 60000, null),
  'estimated window open at KO+130′',
)
assert(
  !inCloudOpsWindow(fixture.kickoff, ko + 181 * 60000, null),
  'hard cap closed at KO+181′',
)

assert(isSchedulableFixture(fixture), 'schedulable real fixture')
assert(
  !isSchedulableFixture({ ...fixture, home: 'TBD' }),
  'TBD home not schedulable',
)

assert(
  anyCloudOpsActivity([fixture], ko - 30 * 60000),
  'anyCloudOpsActivity at window open',
)
assert(
  !anyCloudOpsActivity([fixture], ko - 31 * 60000),
  'anyCloudOpsActivity before window',
)

// Live ΠΡΟΓΡΑΜΜΑ: 2026-08-08 afternoon should be idle
assert(
  !anyCloudOpsActivity(undefined, Date.parse('2026-08-08T15:00:00Z')),
  'no activity on 2026-08-08 15:00Z',
)

if (failed) {
  console.error(`\n${failed} failure(s)`)
  process.exit(1)
}
console.log('\nAll cloud-ops window tests passed.')
