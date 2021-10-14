# Data flow

Front end client makes a request to AIDBOX_URL directly, so you cannot change entrypoints if you need specific behaviour, but you can add service which may be written on any language (currently we use [NodeJS server sdk](https://github.com/Aidbox/node-server-sdk/tree/v2)) to extend Aidbox's behaviour.

The following env variables let Aidbox server register and use your application service:
```sh
APP_ID
APP_SECRET
APP_URL
APP_PORT
```

# Manifest

To register seeds, change schema, add custom operations, etc., you need to create a manifest. For example:

```js
export const manifest = {
  resources: {
    Client: {
      'some-client': {
        'some-field': 'some-data',
      },
    },
    User: {
      'some-user': {
        'some-field': 'some-data',
      },
    },
  },
  operations: {
    'any name of operation': {
      method: 'GET',
      path: ['url-to-make-request'],
      handlerFn: async (request, { ctx }) => {
        return 'hello world';
      },
    },
  },
  entities: {
    Patient: {
      attrs: {
        some-attr: {
          type: 'boolean',
        },
      },
    },
  },
};
```

You can discover our [current manifest](https://github.com/Aidbox/aidbox-react-app/blob/master/node-app/src/index.ts#L39)


# Add custom operations

You can add as much custom operations as you want, for eample:

```js
// operations-file
export const op = {
  method: 'POST',
  path: ['do-somehting-and-send-email'],
  handlerFn: async (request, { ctx }) => {
    // do somehting
    sendMail({
      from: 'test@test.our',
      to: 'test@test.your',
      subject: 'Hello World',
      html: `<html><p>Hello world</p></html>`,
    });
  },
};

// in manifest file
import * as operations from './operations-file'
const manifest = { ..., operations }


```
So from client you jsut need to send POST request to `http://AIDBOX_URL/do-something-and-send-email.`
