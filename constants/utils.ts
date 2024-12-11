import { Storage } from "expo-sqlite/kv-store";

export function groupBy<K extends string | number, V>(
  list: Array<V>,
  keyGetter: (input: V) => K
): Record<K, Array<V>> {
  let map: Record<K, Array<V>> = {} as Record<K, Array<V>>;
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map[key];
    if (!collection) {
      map[key] = [item];
    } else {
      collection.push(item);
    }
  });
  return map;
}

export function getHealthyPercentage(scans: Record<string, string[]>) {
  const getDatesForRange = (start: number, end: number) =>
    Array.from(
      { length: end - start + 1 },
      (_, i) =>
        new Date(
          Date.now() -
            new Date().getTimezoneOffset() * 60000 -
            1000 * 60 * 60 * 24 * (i + start)
        )
          .toISOString()
          .split("T")[0]
    );

  const thisWeek = getDatesForRange(0, 6);
  const lastWeek = getDatesForRange(7, 13);

  const stats = Object.values(scans)
    .flat()
    .reduce(
      (acc, time) => {
        const scanDate = new Date(Number(time)).toISOString().split("T")[0];
        const isHealthy = ["A", "B", "C", "a", "b", "c"].includes(
          JSON.parse(Storage.getItemSync(time)!).nutriscore
        );

        if (thisWeek.includes(scanDate)) {
          isHealthy ? acc.healthyThisWeek++ : acc.unhealthyThisWeek++;
        } else if (lastWeek.includes(scanDate)) {
          isHealthy ? acc.healthyLastWeek++ : acc.unhealthyLastWeek++;
        }

        return acc;
      },
      {
        healthyThisWeek: 0,
        unhealthyThisWeek: 0,
        healthyLastWeek: 0,
        unhealthyLastWeek: 0,
      }
    );

  const getPercentage = (healthy: number, unhealthy: number) =>
    (healthy / (healthy + unhealthy)) * 100;

  const thisWeekPercent = getPercentage(
    stats.healthyThisWeek,
    stats.unhealthyThisWeek
  );
  const lastWeekPercent = getPercentage(
    stats.healthyLastWeek,
    stats.unhealthyLastWeek
  );

  return Math.round(thisWeekPercent - lastWeekPercent);
}
