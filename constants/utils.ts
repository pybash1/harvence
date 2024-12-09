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
