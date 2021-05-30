# throttle-url

## Install

```js
yarn add throttle-url
```

## Example

为某个接口实现最大并发量

```ts
import { throttleUrl } from "throttle-url";

async function ping() {
  const removeThrottle = throttleUrl({
    // 接口名称，用来计数标记
    url: "/ping",
    // 并发最大值任务数
    max: 100,
    // 每个任务最大时间，超时自动移除当前任务
    timeout: 5000,
    // 当达到并发最大值时执行
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
