// Test data helpers. Every record uses the "QA" prefix and qa.*@example.com so it is easy to find and clean up.
export const stamp = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;
export const auPhone = () => '4' + String(Math.floor(10_000_000 + Math.random() * 89_999_999));
export const qaEmail = (kind: string) => `qa.${kind}.${stamp()}@example.com`;

export const ENTITY_ROLE = 'entityPrincipalAdmin';

export function supportStaffBody(overrides: Record<string, unknown> = {}) {
  return { fullName: `QA Staff ${stamp()}`, email: qaEmail('staff'), profilePhoto: null, countryCode: '+61', contactNumber: auPhone(), title: 'QA Lead', ...overrides };
}

export function superAdminBody(overrides: Record<string, unknown> = {}) {
  return { fullName: `QA Super Admin ${stamp()}`, email: qaEmail('sa'), profilePhoto: null, title: 'QA Lead', ...overrides };
}

export function entityBody() {
  const s = stamp();
  return {
    entityDetails: { name: `QA Entity ${s}`, email: qaEmail('entity'), entityPhone: auPhone(), countryCode: '+61', entityLogo: '' },
    principalAdminDetails: { fullName: 'QA Principal Admin', email: qaEmail('principal'), contactNumber: auPhone(), countryCode: '+61', title: 'QA Lead', profilePhoto: '', id: null as string | null },
    api: { username: null, password: null },
  };
}

export function entityStaffBody(entityId: string, role: 'entityPrincipalAdmin' | 'entitySupportStaff') {
  return { fullName: `QA Entity User ${stamp()}`, email: qaEmail('es'), profilePhoto: null, countryCode: '+61', contactNumber: auPhone(), title: 'QA Lead', entity: entityId, role };
}

export function clientBody(entityId: string, securityNumberId: string) {
  return {
    clientDetails: { firstName: 'QA', lastName: `Client ${stamp()}`, safeWord: 'qasafe', duressWord: 'qaduress', email: qaEmail('client'), homeAddress: '1 Test Street, Sydney NSW', workAddress: '2 Test Street, Sydney NSW', countryCode: '+61', phoneNumber: auPhone(), profilePhoto: '', patriotClientNumber: '' },
    emergencyContact: [{ name: 'QA Emergency Contact', phoneNumber: auPhone(), countryCode: '+61' }],
    familyDetails: null, callSecurityNumber: '', callSecurityNumberId: securityNumberId, app: 'secure',
    standardOperatingProcedure: 'QA standard operating procedure', sendSms: false, sendEmail: false, currentCity: null, entityId,
  };
}
