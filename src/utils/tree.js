export function getAllChildrenIds(ids, data) {
  if (data.children !== undefined) {
    for (let i = 0; i < data.children.length; i++) {
      ids.push(data.children[i].id);
      const child = data.children[i]
      getAllChildrenIds(ids, child)
    }
  } else {
    return;
  }
}