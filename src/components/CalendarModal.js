import React from 'react'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
//import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, {Draggable} from "@fullcalendar/interaction"; // needed for dayClick
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import Database from '../Database'

import SetDateModal from './SetDateModal'

//import './main.scss' // webpack must be configured to do this

export default class CalendarModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            calendarEvents: [{title: "Event now", start: new Date()}],
            eventsList: [{title: 'event now'}],
            updateList: null,
            showSetDateModal: false,
            modalData: null,
            saving: "Save Changes"
        }

        this.handleDrop = this.handleDrop.bind(this)
        this.handleEventDrop = this.handleEventDrop.bind(this)
        this.handleEventClick = this.handleEventClick.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.updateDates = this.updateDates.bind(this)
        this.saveChangesToDB = this.saveChangesToDB.bind(this)
        this.saveHelper = this.saveHelper.bind(this)
    }

    componentDidMount() {
        let events = this.props.schedule
        let formattedEvents = []
        let curriculums = []
        let curricSet = new Set([])
        function format(mod) {
            if (mod.module && mod.module.published) {
                let draggableEvent = {id: mod.id,
                                    title: mod.module.name,
                                    start: '',
                                    extendedProps: { members: mod.members, } }
                let startTime = {id: mod.id + 'rel',
                                    title: mod.module.name + ' release date',
                                    start: '',
                                    extendedProps: { members: mod.members, } }
                let endTime = {id: mod.id + 'due',
                                    title: mod.module.name + ' due date',
                                    start: '',
                                    extendedProps: { members: mod.members, } }
                if (curricSet.has(mod.curriculum)) {
                    for (const curric of curriculums) {
                        if (curric.id === mod.curriculum) {
                            curric.mods.push(draggableEvent)
                        }
                    }
                } else {
                    curriculums.push({
                        id: mod.curriculum,
                        title: mod.curricName,
                        mods: [draggableEvent]
                    })
                    curricSet.add(mod.curriculum)
                }
                if (mod.openTime === "" || mod.closeTime === "") { //unassigned modules

                } else {

                    startTime.start = mod.openTime
                    formattedEvents.push(startTime)

                    endTime.start = mod.closeTime
                    formattedEvents.push(endTime)
                }
            }
        }


        events.forEach(elem => format(elem))

        this.setState({calendarEvents: formattedEvents, eventsList: curriculums})
        let draggedEl = document.getElementById('external-events')
        new Draggable(draggedEl, {
            itemSelector: ".fc-event",
            eventData: function(eventEl) {
                let title = eventEl.getAttribute("title");
                let id = eventEl.getAttribute("id");
                let extendedProps = eventEl.getAttribute("extendedProps")
                return {
                    title: title,
                    id: id,
                    allDay: false,
                    extendedProps: extendedProps
                };
            }
        })
        // this.setState({calendarEvents: events})

    }

    saveHelper() {
        this.setState({saving: "Saving..." })
        let updateList = this.state.updateList
        if ((updateList !== null) && (updateList.length > 0)) {
            this.saveChangesToDB(updateList, 0)
        } else {
            alert('no changes to be saved')
            this.setState({ saving: "Save Changes" })
        }
    }

    saveChangesToDB(updateList, index) {

        let classCode = this.props.classCode
        let moduleData = updateList[index]
        let moduleId = moduleData.id
        let tempUpdateList = updateList
        let tempLength = updateList.length
        let tempIndex = index

        let tempThis = this
        function onSuccessSchedule(result) {
            // 2a: schedule update suceeded

            function onSuccessMembers(result){
                // 4a: members update suceeded
                // Done, so re-query database
                if (tempIndex + 1 < tempLength) {
                    tempThis.saveChangesToDB(tempUpdateList, tempIndex + 1)
                } else {
                    tempThis.setState({ saving: "Save Changes" })
                    alert("Schedule successfully saved")
                    tempThis.props.runModuleQuery()
                }
                // tempThis.close()
            }
            function onFailureMembers(error){
                // 4b: members update failed
                alert(error)
                // Done, so re-query database
                if (tempIndex + 1 < tempLength) {
                    tempThis.saveChangesToDB(tempUpdateList, tempIndex + 1)
                } else {
                    tempThis.props.runModuleQuery()
                }
                // tempThis.close()
                tempThis.setState({ saving: "Save Changes" })
            }

            // 3: Now update Student members
            let membersArr = moduleData.members
            Database.setModuleMembers(classCode, moduleId,
                membersArr, onSuccessMembers, onFailureMembers)
        }
        function onFailureSchedule(error) {
            // 2b: schedule update failed
            alert(error)
        }

        // //1: Update schedule
        let releaseDate = moduleData.startTime
        let dueDate = moduleData.closeTime
        Database.rescheduleModule(classCode, moduleId, releaseDate,
            dueDate, onSuccessSchedule, onFailureSchedule)

    }


    closeModal(name) {
        this.setState({showSetDateModal: false})
    }

    handleDrop(info) {
        info.event.setAllDay(false)
        let event = info.event
        let calendar = event._calendar
        event.remove()
        if (calendar.getEventById(event.id + 'rel') === null) {

            let id = event.id
            let startA = new Date(event.start)
            let startB = new Date(event.start.setDate(event.start.getDate() + 1))
            let title = event.title
            let calendar = event._calendar
            let extendedProps = { members: [] }


            let relDate = {title: title + ' release date',
                            id: id + 'rel',
                            start: startA,
                            _calendar: calendar,
                            extendedProps: extendedProps }
            calendar.addEvent(relDate)
            // console.log(event)

            let dueDate = {title: title + ' due date',
                            id: id + 'due',
                            start: startB,
                            _calendar: calendar,
                            extendedProps: extendedProps }

            calendar.addEvent(dueDate)

            this.updateDates(relDate)
        } else {
            if (window.confirm(event.title +  ' has already been scheduled, do you want to reschedule it?')) {
                let startA = new Date(event.start)
                let startB = new Date(event.start.setDate(event.start.getDate() + 1))
                let relDate = calendar.getEventById(event.id + 'rel')
                relDate.setDates(startA)
                let dueDate = calendar.getEventById(event.id + 'due')
                dueDate.setDates(startB)
                this.updateDates(relDate)
            }
        }

    }

    handleEventDrop(info) {
        let delta = info.delta
        let event = info.event
        let start
        let end
        let moduleId = info.event.id.slice(0, info.event.id.length - 3)
        let rel
        if (event.id.slice(-3) === 'rel') {
            start = event
            end = event._calendar.getEventById(moduleId + 'due')
            rel = true
        } else {
            start = event._calendar.getEventById(moduleId + 'rel')
            end = event
            rel = false
        }
        if (start.start >= end.start) {
            if (rel) {
                end.moveDates(delta)
            } else {
                start.moveDates(delta)
            }
        } else {
            this.updateDates(info.event)
        }
    }

    handleEventClick(info) {
        //let calendarEvents = this.state.calendarEvents
        let studentList = this.props.allModuleData.Data.Students
        let start
        let end
        let moduleId = info.event.id.slice(0, info.event.id.length - 3)
        if (info.event.id.slice(-3) === 'rel') {
            start = info.event
            end = info.event._calendar.getEventById(moduleId + 'due')
        } else {
            end = info.event
            start = info.event._calendar.getEventById(moduleId + 'rel')
        }
        this.setState({
            showSetDateModal: true,
            modalData: {start: start, end: end, students: studentList}
        })

    }

    updateDates(mod) {
        let updateList = this.state.updateList
        let newModule ={id: mod.id.slice(0, mod.id.length - 3), members: mod.extendedProps.members, startTime: '', closeTime: ''}
        if (mod.id.slice(-3) === 'rel') {
            newModule.startTime = mod.start
            newModule.closeTime = mod._calendar.getEventById(newModule.id + 'due').start
        } else {
            newModule.closeTime = mod.start
            newModule.startTime = mod._calendar.getEventById(newModule.id + 'rel').start
        }
        if (updateList === null) {
            updateList = [newModule]
        } else {
            let i = 0
            let tagg = true
            while (i < updateList.length) {
                if (updateList[i].id === newModule.id) {
                    updateList[i] = newModule
                    tagg = false
                    i = updateList.length
                }
                i += 1
            }
            if (tagg) {
                updateList.push(newModule)
            }
        }
        // console.log(updateList)

        this.setState({updateList: updateList})
    }

    render() {

        return (
            <div>
                {this.state.showSetDateModal &&
                    <SetDateModal
                        close={this.state.showSetDateModal}
                        closeModal={this.closeModal}
                        modalData={this.state.modalData}
                        sendUpdates={(item) => this.updateDates(item)} />
                }
                <div>
                    <div id='external-events'>
                        {this.state.eventsList.map((curric) => {
                            let elements = null
                            if ((curric.mods !== null) && (curric.mods !== undefined)) {
                                elements = Object.keys(curric.mods).map((event) => {
                                    return (
                                        <div
                                            className="fc-event"
                                            title={curric.mods[event].title}
                                            data={curric.mods[event].data}
                                            key={curric.mods[event].data}
                                            id={curric.mods[event].id}>
                                            {curric.mods[event].title}
                                        </div>
                                    )
                                })
                            }
                            return (
                                <div style={{overflow:'auto',
                                    marginLeft: '5vw',
                                    marginBottom: '5vh',
                                    padding: '2vh 2vh 2vh 2vh',
                                    width: '25vh',
                                    borderRadius: '2vh',}}>
                                    <h4>{curric.title}</h4>
                                    {elements}
                                </div>
                            )
                        })}
                    </div>
                </div>
            {/* drop is a callback function for when external events are moved to calendar
              * dropInfo has params date: where draggable was dropped in data object format
              *                     dateStr: the ISO8601 string representation of where the draggable was dropped
              *                     draggedEl: the hmtl element that was being dragged refering to the module elements
              */}
            {/* eventDrop is a callback function for when a calendar item is moved to a different or same date
              * eventDropInfo has params event: Event Object that holds (date, title, data) of event after drop
              *                          oldevent: info of event from before it was dropped
              *                          draggedEl: the hmtl element that was being dragged
              */}
                <div>
                    <FullCalendar id='calendar'
                        defaultView="dayGridMonth"
                        plugins={[dayGridPlugin, interactionPlugin]}
                        header={{
                          center: 'saveChanges'
                        }}
                        customButtons={{
                            saveChanges: {
                                text: this.state.saving,
                                click: this.saveHelper
                            }
                        }}
                        weekends={true}
                        events={this.state.calendarEvents}
                        editable={true}
                        droppable={true}

                        eventReceive={(dropInfo) => this.handleDrop(dropInfo)}

                        eventDrop={(eventDropInfo) => this.handleEventDrop(eventDropInfo)}

                        eventClick={(eventClickInfo) => this.handleEventClick(eventClickInfo)}
                    />
                </div>
            </div>

        )
    }

}