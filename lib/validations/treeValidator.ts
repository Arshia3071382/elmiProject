// src/lib/validations/treeValidator.ts
import { INode } from "./../..//models/Topic";

export interface ValidationError {
  type: "BROKEN_LINK" | "ORPHAN_NODE" | "MISSING_START_NODE";
  message: string;
  nodeId?: string;
}

/**
 * اعتبارسنجی کامل درخت مکالمه
 * @param startNodeId شناسه نود شروع (مثلاً 'start' یا 'root')
 * @param nodesMap شیء حاوی تمام نودهای تاپیک
 */
export function validateConversationTree(
  startNodeId: string,
  nodesMap: Record<string, INode> | Map<string, INode>
): ValidationError[] {
  const errors: ValidationError[] = [];

  // تبدیل Map به Record معمولی در صورتی که از Mongoose Map استفاده شده باشد
  const plainNodes: Record<string, INode> =
    nodesMap instanceof Map
      ? Object.fromEntries(nodesMap.entries())
      : nodesMap || {};

  const nodeIds = new Set(Object.keys(plainNodes));

  // اگر هیچ نودی وجود ندارد، خطایی بازگردانده نمی‌شود (فرم در حال ساخت اولیه است)
  if (nodeIds.size === 0) return errors;

  // ۱. بررسی وجود داشتن نود شروع (Start Node)
  if (!nodeIds.has(startNodeId)) {
    errors.push({
      type: "MISSING_START_NODE",
      message: `نود شروع با شناسه "${startNodeId}" در لیست نودها یافت نشد.`,
    });
    return errors;
  }

  const visitedNodes = new Set<string>();
  const queue: string[] = [startNodeId];

  // پیمایش الگوریتم BFS برای یافتن نودهای قابل دسترس و لینک‌های شکسته
  while (queue.length > 0) {
    const currentId = queue.shift()!;

    if (visitedNodes.has(currentId)) continue;
    visitedNodes.add(currentId);

    const currentNode = plainNodes[currentId];
    if (!currentNode) continue;

    if (Array.isArray(currentNode.options)) {
      for (const option of currentNode.options) {
        if (option.nextNodeId) {
          // ۲. بررسی مقصد گزینه‌ها (Broken Link)
          if (!nodeIds.has(option.nextNodeId)) {
            errors.push({
              type: "BROKEN_LINK",
              message: `گزینه "${option.text}" در نود "${currentId}" به نود ناموجود "${option.nextNodeId}" اشاره می‌کند.`,
              nodeId: currentId,
            });
          } else if (!visitedNodes.has(option.nextNodeId)) {
            queue.push(option.nextNodeId);
          }
        }
      }
    }
  }

  // ۳. بررسی نودهای یتیم (Orphan Nodes - نودهایی که در دیتابیس هستند اما از start به آن‌ها دسترسی نیست)
  nodeIds.forEach((id) => {
    if (!visitedNodes.has(id)) {
      errors.push({
        type: "ORPHAN_NODE",
        message: `نود "${id}" به هیچ مسیر مکالمه‌ای متصل نیست و غیرقابل دسترس است.`,
        nodeId: id,
      });
    }
  });

  return errors;
}