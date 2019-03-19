/*
 * plumb.js
 * 创建连线的公共方法
 * */

// 公共配置
/* 设置默认值*/
const CONFIG = {
    anchor: ['TopCenter', 'RightMiddle', 'BottomCenter', 'LeftMiddle'],
    endpoints: ['Dot'],
    detachable: false,
    connectorStyle: {stroke: '#666'}, //连接线的类型
    connectorOverlays: ['Arrow', {location: 0.5}],
    deleteEndpointsOnDetach: false
}

jsPlumb.importDefaults({
    connector: ['Straight'],
    endpoint: 'Rectangle',
    paintStyle: {strokeWidth: 4, fill: 'red'},
    DragOptions: {cursor: 'pointer', zIndex: 2000},
    ConnectionsDetachable: false,
    ConnectionOverlays: [ //配置连线的覆盖物
        ['Arrow', { //箭头
            location: 1,
            width: 20,
            id: 'arrow',
            length: 14,
            foldback: 0.8,
            events: { //点击箭头的事件
                click: function () { alert('点击连线箭头的事件')}
            }
        }],
        ['Label', { //标签（连线上的文字表示）
            label: '<i>FOO</i>',
            id: 'label',
            cssClass: 'aLabel',
            events: { //点击标签
                click: function () { alert('点击连线标签文字的事件'); }
            }
        }]
    ],
});

export function addItem(container,data) {
   let html='<div id='+data.tName+'>'+data.cont+'</div>'
    console.log(html)
    container.appendChild(html);
}

export function addEndpoint(id) {
    let dom=document.getElementById(id);
    jsPlumb.addEndpoint(dom, {
         // uuid: id,//如果只需要一个锚点则可以不配置uuid
        anchor: ['TopCenter', 'RightMiddle', 'BottomCenter', 'LeftMiddle'],
        allowLoopback: false,
        isSource: true,
        isTarget: true,
        connectorStyle: {//配置连接线的样式（以锚点为单位）
            strokeWidth: 5,
            stroke: 'red',
            joinstyle: 'round',
            outlineWidth: 2
        },

    })
}

// 让元素可拖动
export function addDraggable(id) {
    let dom=document.getElementById(id);
    jsPlumb.draggable(dom, {
        containment:true
    })
}

//创建连接（为已有连接关系的元素）
export function createLink(sId,tId){
    jsPlumb.connect({
        source: sId,
        target: tId,
    })
}

// 当链接建立
jsPlumb.bind('beforeDrop', function (info) {
    alert('建立连接之前的处理数据');
   /* if(info.sourceId === info.targetId){
        return false;
    }*/
    return true;
})

// 双击连接线
jsPlumb.bind('dblclick', function (conn, originalEvent) {
    jsPlumb.deleteConnection(conn) //删除连接线(节点)
    // jsPlumb.remove(id) //删除节点
    alert('双击连接线，删除连接')
})
