import React from "react"

import HomeCourseCard from './HomeCourseCard'

class HomeSubCourses extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            // details on which course to display, TODO i guess
            whichCourse: null
        }

        this.swapToCourseCurriculum = this.swapToCourseCurriculum.bind(this)
    }

    // Pass this function to the HomeCourseCard so we know when to swap to a course/curriculum
    swapToCourseCurriculum(identifier, isClass){
        //grab the appropriate JSON based on whichever curriculum/class was clicked
        var chosenCourse
        if (isClass) { //grab class data
            var classes = this.props.classDataJson.Classes
            for (var i = 0; i < classes.length; i++) {
                var classroom = classes[i]
                if (classroom.code === identifier) {
                    chosenCourse = classroom
                }
            }
        } else { //grab curriculum data
            var curriculums = this.props.classDataJson.Curriculum
            for (i = 0; i < curriculums.length; i++) {
                var curric = curriculums[i]
                if (curric.id === identifier) {
                    chosenCourse = curric
                }
            }
        }
        // swap to the distint course component
        this.props.swapSubwindow('distinctCourse', chosenCourse)
    }

    render() {
        let classCardComponents = []
        if (this.props.classDataJson != null) {
            for (const card of this.props.classDataJson.Classes) { //iteratively add all class components
                classCardComponents.push(
                    <HomeCourseCard key={card.code} //required for lists of components
                                    code={card.code}
                                    isClass={true}
                                    cardType={card.enabled ? 'enabled' : 'disabled'}
                                    primaryText={card.name}
                                    secondaryText={card.instructor}
                                    color={card.color}
                                    piece={card.piece}
                                    swapFunc={this.swapToCourseCurriculum} />
                )
            }
        }
        classCardComponents.push(     // add a purchase card at the end
            <HomeCourseCard key={'purchase1'}
                            isClass={true}
                            cardType={'purchase'}
                            swapFunc={this.swapToCourseCurriculum}
                            toggleModal={this.props.toggleModal}/>
        )

        let curriculumCardComponents = []
        if (this.props.classDataJson != null) {
            for (const card of this.props.classDataJson.Curriculum) {
                if (!card.published) {
                    continue //ignore unpublished curriculums
                }
                curriculumCardComponents.push(
                    <HomeCourseCard key={card.id}
                                    code={card.id}
                                    isClass={false}
                                    cardType={card.enabled ? 'enabled' : 'disabled'}
                                    primaryText={card.name}
                                    color={card.color}
                                    piece={card.piece}
                                    swapFunc={this.swapToCourseCurriculum} />
                )
            }
        }
        curriculumCardComponents.push(  // add a purchase card at the end
            <HomeCourseCard key={'purchase2'}
                            isClass={false}
                            cardType={'purchase'}
                            swapFunc={this.swapToCourseCurriculum}
                            toggleModal={this.props.toggleModal} />
        )

        return (
            <div>
                <h1 style={{fontSize: "3.5vh", marginLeft:"1.5vw"}}>Classes</h1>
                <div style={{overflow:'auto'}}>
                    {classCardComponents}
                </div>

                <h1 style={{fontSize: "3.5vh", marginLeft: "1.5vw"}}>Curriculums</h1>
                <div style={{overflow:'auto'}}>
                    {curriculumCardComponents}
                </div>
            </div>
        )
    }
}

export default HomeSubCourses