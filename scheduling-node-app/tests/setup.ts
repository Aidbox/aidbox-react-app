import { resetInstanceToken, setInstanceBaseURL } from 'aidbox-react/lib/services/instance';
import { service } from 'aidbox-react/lib/services/service';
import { ensure, withRootAccess } from 'aidbox-react/lib/utils/tests';

let txId: string;

beforeAll(async () => {
  setInstanceBaseURL('http://localhost:8989');

  await withRootAccess(async () => {
    const result = ensure(
      await service({
        method: 'POST',
        url: '/$psql',
        params: { execute: 'true' },
        data: {
          query: `DROP FUNCTION IF EXISTS drop_before_all(integer);
CREATE FUNCTION drop_before_all(integer) RETURNS VOID AS $$
declare
e record;
BEGIN
FOR e IN (select LOWER(entity.id) as t_name from entity where resource#>>'{type}' = 'resource' and id != 'OperationOutcome') LOOP
    EXECUTE 'delete from "' || e.t_name || '" where txid > ' || $1 ;
END LOOP;
END;
$$ LANGUAGE plpgsql;`,
        },
      }),
    );

    console.log(result);
  });
});

beforeEach(async () => {
  await withRootAccess(async () => {
    const data = ensure(
      await service({
        method: 'POST',
        url: '/$psql',
        data: { query: 'SELECT last_value from transaction_id_seq;' },
      }),
    );
    txId = data[0].result[0].last_value;
  });
});

afterEach(async () => {
  resetInstanceToken();
  await withRootAccess(async () => {
    ensure(
      await service({
        method: 'POST',
        url: '/$psql',
        data: { query: `select drop_before_all(${txId});` },
      }),
    );
  });
});
