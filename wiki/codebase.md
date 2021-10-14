# Data flow

In order to access both native and custom Aidbox endpoints, the front-end client makes requests to the `AIDBOX_URL` directly. In case you want to customize Aidbox behaviour, for example add custom operations, you can do it by registering your custom back-end as a service in Aidbox. You are free to use your preferred programming language for your custom back-end. This project has a custom NodeJS back-end and uses the [Aidbox NodeJS Server SDK](https://github.com/Aidbox/node-server-sdk/tree/v2) for an easier integration.

A custom back-end contains a `manifest`. Aidbox uses the manifest to create a service with your back-end, which becomes available on a specified URL, and all requests to your endpoints will be redirected to this URL. For example, in order to call your custom endpoint named `do-something-and-send-email` you will need to make the following request to Aidbox: `http://AIDBOX_URL/do-something-and-send-email`. Aidbox will redirect the request to your back-end app.

NodeJS SDK uses the following env variables to register your back-end application in Aidbox:

```sh
APP_ID
APP_SECRET
APP_URL
APP_PORT
```

# Manifest

To create data at start, add custom operations, resources, etc., you need to create a manifest. A manifest example:

```js
export const manifest = {
  resources: {
    Client: {
      'some-client-id': {
        'some-field': 'some-data',
      },
    },
    User: {
      'some-user-id': {
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

When the application will start, the manifest will be uploaded to the Aidbox server.

Discover our [sample manifest](https://github.com/Aidbox/aidbox-react-app/blob/master/node-app/src/index.ts#L39).

# Add custom operations

You can add as much custom operations as you want, for example:

```js
// in operations file
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

Also, check out our [docker-compose](https://github.com/Aidbox/node-server-sdk/blob/main/docker-compose.yml) file.
