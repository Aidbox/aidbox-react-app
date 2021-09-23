import { saveFHIRResource } from 'aidbox-react/lib/services/fhir';
import { service } from 'aidbox-react/lib/services/service';
import { withRootAccess } from 'aidbox-react/lib/utils/tests';
import { ensure } from 'aidbox-react/lib/utils/tests';

import { Patient } from 'shared/src/contrib/aidbox';

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
