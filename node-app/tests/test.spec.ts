import { withRootAccess } from 'aidbox-react/lib/utils/tests';
import { saveFHIRResource } from 'aidbox-react/lib/services/fhir';
import { ensure } from 'aidbox-react/lib/utils/tests';
import { service } from 'aidbox-react/lib/services/service';

interface Patient {
  readonly resourceType: 'Patient';
}

test('Test something', async () => {
  await withRootAccess(async () => {
    ensure(
      await saveFHIRResource<Patient>({
        resourceType: 'Patient',
      }),
    );
  });

  await withRootAccess(async () => {
    const result = ensure(await service({ url: '/testApi', method: 'get' }));
    expect(result).toBe(1);
  });
});
