export function toTreeData(data, attributes) {
    let resData = data;
    let tree = [];
    for (let i = 0; i < resData.length; i++) {
        if (resData[i][attributes.parentId] == attributes.rootId) {
            let obj = {
                id: resData[i][attributes.id],
                label: resData[i][attributes.name],
                prentId: resData[i][attributes.parentId],
                children: []
            };
            tree.push(obj);
            resData.splice(i, 1);
            i--;
        }
    }
    run(tree);
    function run(chiArr) {
        if (resData.length != 0) {
            for (let i = 0; i < chiArr.length; i++) {
                for (let j = 0; j < resData.length; j++) {
                    if (chiArr[i].id == resData[j][attributes.parentId]) {
                        let obj = {
                            id: resData[j][attributes.id],
                            label: resData[j] ? resData[j][attributes.name] : '',
                            prentId: resData[i] ? resData[i][attributes.parentId] : '',
                            children: []
                        };
                        chiArr[i].children.push(obj);
                        resData.splice(j, 1);
                        j--;
                    }
                }
                run(chiArr[i].children);
            }
        }
    }
    return tree;

}
