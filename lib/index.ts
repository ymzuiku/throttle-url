import { nanoid } from "nanoid";

// 缓存对象，用于测试或检测
export const throttleUrlCache = {} as { [url: string]: Set<string> };

/* 限制一个 url 的请求间隔，若函数返回为的对象包含 error，表示需要阻拦 */
export const throttleUrl = ({
  url,
  max,
  onMax,
  timeout,
}: {
  // 接口URL
  url: string;
  // 若遇到错误
  onMax: (size: number) => any;
  // 最大并发量
  max: number;
  // 每条任务超时自动删除
  timeout: number;
}) => {
  // 根据URL初始化缓存对象
  if (!throttleUrlCache[url]) {
    throttleUrlCache[url] = new Set<string>();
  }

  // URL缓存对象
  const box = throttleUrlCache[url];

  // 任务 ID
  const id = nanoid();

  // 用于移除任务的方法
  const removeId = () => {
    if (box.has(id)) {
      box.delete(id);
    }
  };

  const size = box.size;

  // 若当前任务超过最大值, 执行 onMax 并且返回, 移除方法
  if (size >= max) {
    onMax(size);
    return removeId;
  }

  // 增加一个任务
  box.add(id);

  // 超时后，移除某个任务
  setTimeout(removeId, timeout);

  return removeId;
};
