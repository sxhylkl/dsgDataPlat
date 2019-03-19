import { getEvents, getParticipantEvents } from '@/api/personOffice/agenda/index'
export function initCalendar () {
    var date = new Date()
    var d = date.getDate()
    var m = date.getMonth()
    var y = date.getFullYear()

    ('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        isRTL: false,
        //height: 650,
        //handleWindowResize : true,
        timeFormat: 'HH:mm',
        weekends: true,
        allDaySlot: false,
        firstDay: 0,
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        eventLimitText: '更多',
        dayPopoverFormat: 'YYYY年M月d日',
        buttonText: {
            prev: '<',
            next: '>',
            prevYear: '上一年',
            nextYear: '下一年',
            today: '返回今天',
            month: '月',
            week: '周',
            day: '日',
            listWeek: '列表'
        },
        navLinks: true,
        selectable: true,
        selectHelper: true,
        editable: true,
        eventLimit: true,
        height: window.innerHeight,
        select: null,
        dayClick: null,
        eventClick: function (event, jsEvent, view) {
            alert('eventClick')
        },
        events: function (start, end, callback) {
            const obj = {start: Date.parse(start), end: Date.parse(end)}
            console.log(obj)
            getEvents(obj).then(data => {
                let events = []
                let i = 0
                console.log(data)
                while (data && data[i] != null) {
                    events.push({
                        isMine: true,
                        title: data[i].title + '(' + (data[i].rateProgress == null ? 0 : data[i].rateProgress) + '%)',
                        start: new Date(data[i].startTime), // will be parsed
                        end: new Date(data[i].endTime),
                        actualStart: data[i].actualStartTime ? new Date(data[i].actualStartTime) : '',
                        actualEnd: data[i].completeTime ? new Date(data[i].completeTime) : '',
                        id: data[i].id,
                        className: 'height:200',
                        rateProgress: data[i].rateProgress,
                        owner: ((data[i].ownerName == null || data[i].ownerName == '') ? data[i].owner : data[i].ownerName),
                        color: data[i].rateProgress >= 100 ? '#9AFF9A' : ((new Date()).getTime() > data[i].endTime ? '#FF6A6A' : '#63B8FF'),
                        committer: (data[i].submitNamer != null ? data[i].submitNamer : data[i].submitter),
                        taskUrl: data[i].taskUrl,
                        openType: data[i].openType,
                        type: data[i].type,
                        remark: data[i].remark
                    })
                    i++
                    getParticipantEvents(obj).then(data => {
                        i = 0
                        while (data && data[i] != null) {
                            events.push({
                                isMine: false,
                                title: data[i].title + '(' + (data[i].rate_progress == null ? 0 : data[i].rate_progress) + '%)',
                                start: new Date(data[i].start_time), // will be parsed
                                end: new Date(data[i].end_time),
                                actualStart: data[i].actual_start_time ? new Date(data[i].actual_start_time) : '',
                                actualEnd: data[i].complete_time ? new Date(data[i].complete_time) : '',
                                id: data[i].id_,
                                mainId: data[i].schedule_id,
                                className: 'height:200',
                                rateProgress: data[i].rate_progress,
                                owner: (data[i].owner_name != null ? data[i].owner_name : data[i].owner),
                                color: data[i].rate_progress >= 100 ? '#9AFF9A' : ((new Date()).getTime() > data[i].end_time ? '#FF6A6A' : '#FFEC8B'),
                                committer: (data[i].submitNamer != null ? data[i].submitNamer : data[i].submitter),
                                taskUrl: data[i].task_url,
                                openType: data[i].open_type,
                                type: data[i].type,
                                remark: data[i].remark
                            })
                            i++
                        }
                        callback(events)
                    })
                }
            })
        }
    })
}

/*let calendar = $('#calendar').fullCalendar('getCalendar')
calendar.on('dayClick', function (date, jsEvent, view) {
    console.log('clicked on')
})*/

export function getEventsList (start,end) {
    console.log('calendar.js')
    const obj = {start:  Date.parse(start._d), end: Date.parse(end._d)}
    console.log(obj)
    getEvents(obj).then(data => {
        let i = 0
        let events = []
        console.log(data)
        while (data && data[i] != null) {
            events.push({
                isMine: true,
                title: data[i].title + '(' + (data[i].rateProgress == null ? 0 : data[i].rateProgress) + '%)',
                start: new Date(data[i].startTime), // will be parsed
                end: new Date(data[i].endTime),
                actualStart: data[i].actualStartTime ? new Date(data[i].actualStartTime) : '',
                actualEnd: data[i].completeTime ? new Date(data[i].completeTime) : '',
                id: data[i].id,
                className: 'height:200',
                rateProgress: data[i].rateProgress,
                owner: ((data[i].ownerName == null || data[i].ownerName == '') ? data[i].owner : data[i].ownerName),
                color: data[i].rateProgress >= 100 ? '#9AFF9A' : ((new Date()).getTime() > data[i].endTime ? '#FF6A6A' : '#63B8FF'),
                committer: (data[i].submitNamer != null ? data[i].submitNamer : data[i].submitter),
                taskUrl: data[i].taskUrl,
                openType: data[i].openType,
                type: data[i].type,
                remark: data[i].remark
            })
            i++
            getParticipantEvents(obj).then(data => {
                i = 0
                while (data && data[i] != null) {
                    events.push({
                        isMine: false,
                        title: data[i].title + '(' + (data[i].rate_progress == null ? 0 : data[i].rate_progress) + '%)',
                        start: new Date(data[i].start_time), // will be parsed
                        end: new Date(data[i].end_time),
                        actualStart: data[i].actual_start_time ? new Date(data[i].actual_start_time) : '',
                        actualEnd: data[i].complete_time ? new Date(data[i].complete_time) : '',
                        id: data[i].id_,
                        mainId: data[i].schedule_id,
                        className: 'height:200',
                        rateProgress: data[i].rate_progress,
                        owner: (data[i].owner_name != null ? data[i].owner_name : data[i].owner),
                        color: data[i].rate_progress >= 100 ? '#9AFF9A' : ((new Date()).getTime() > data[i].end_time ? '#FF6A6A' : '#FFEC8B'),
                        committer: (data[i].submitNamer != null ? data[i].submitNamer : data[i].submitter),
                        taskUrl: data[i].task_url,
                        openType: data[i].open_type,
                        type: data[i].type,
                        remark: data[i].remark
                    })
                    i++
                }
            })
        }
        return events
    })
}

