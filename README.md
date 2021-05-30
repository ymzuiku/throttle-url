# throttle-url

## Install

```js
yarn add throttle-url
```

## Example

为某个接口实现最大并发量

```ts
import { throttleUrl } from "./throttleUrl";

async function ping() {
  const removeThrottle = throttleUrl({
    url: "/ping",
    max: 100,
    timeout: 5000,
    onMax: (i) => {
      throw `请稍后再试，当前并发: ${i}`;
    },
  });

  try {
    await new Promise((res, rej) => {
      setTimeout(() => {
        if (Math.random() > 0.8) {
          rej("异步错误");
        } else {
          res(void 0);
        }
      }, 2000);
    });
  } catch (err) {
    removeThrottle();
    throw err;
  }

  removeThrottle();
  return "pong";
}
```
