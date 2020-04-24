import React from 'react'

class AdminModuleListing extends React.Component {

    // receives as props:
    // moduleId: tells which module this listing represents
    // moduleName: the name of the module
    // toggleModal: function used to toggle on the modal
    // setSelectedModule: function used to select which module was clicked
    constructor(props) {
        super(props)

        this.handleEdit = this.handleEdit.bind(this)
    }

    handleEdit(event) {
        this.props.toggleModal(this.props.moduleData)
        this.props.setSelectedModule(this.props.moduleId, this.props.moduleName)
    }

    render() {
        return (
            <div onClick={this.handleEdit} style={{backgroundColor:"white", height: "6vh", marginBottom: "2vh", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0", cursor: "pointer"}}>
                <div style={{padding: "2vh 0 2vh 1vh"}}>
                    <h4 style={{margin:0, fontSize: "1.7vh", float: "left", overflow: "hidden", width: "50%"}}>{this.props.moduleName}</h4>
                </div>

            </div>
        )
    }

}

export default AdminModuleListing