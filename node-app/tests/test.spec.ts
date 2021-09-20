import { withRootAccess } from 'aidbox-react/lib/utils/tests';
import { saveFHIRResource } from 'aidbox-react/lib/services/fhir';
import { ensure } from 'aidbox-react/lib/utils/tests';
import { service } from 'aidbox-react/lib/services/service';

interface Patient {}

test('Test something', async () => {
  withRootAccess(async () => {
    ensure(
      await saveFHIRResource<Patient>({
        resourceType: 'Patient',
        id: 'test',
      }),
    );
  });
  withRootAccess(async () => {
    const result = ensure(await service({ url: '/testApi', method: 'get' }));
    expect(result).toBe(1)
  });
});
