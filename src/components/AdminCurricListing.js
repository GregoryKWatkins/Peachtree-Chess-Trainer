import React from 'react'

class AdminCurricListing extends React.Component {

    // receives as props:
    // curricId: Id for this curriculum
    // curricName: name for this curriculum
    // curricColor: Hex value describing the desired color
    // curricDesc: description that will display on the pricing page
    // curricPiece: the chess piece icon to associate with this curriculum
    // curricPrice: the price in USD to charge for this curriculum
    // moduleIds: a list of modules currently assigned to this curriculum
    // published: whether or not this curriculum should be available to purchase yet
    // toggleModal: function to toggle on the curriculum editing modal
    // setSelectedCurric: function to set this curriculum as selected
    constructor(props) {
        super(props)

        this.handleEdit = this.handleEdit.bind(this)
    }

    handleEdit(event) {
        this.props.toggleModal(this.props.moduleData)

        let props = this.props
        let curric = {
            curricId: props.curricId,
            curricName: props.curricName,
            curricColor: props.curricColor,
            curricDesc: props.curricDesc,
            curricPiece: props.curricPiece,
            curricPrice: props.curricPrice,
            moduleIds: props.moduleIds,
            published: props.published
            }
        this.props.setSelectedCurric(curric)
    }

    render() {
        return (
            <div onClick={this.handleEdit} style={{backgroundColor:"white", height: "6vh", marginBottom: "2vh", border: "solid", borderRadius:"1vh", borderWidth:".25vh", borderColor: "#c0c0c0", cursor: "pointer"}}>
                <div style={{padding: "2vh 0 2vh 1vh"}}>
                    <h4 style={{margin:0, fontSize: "1.7vh", float: "left", overflow: "hidden", width: "50%"}}>{this.props.curricName}</h4>
                </div>

            </div>
        )
    }

}

export default AdminCurricListing