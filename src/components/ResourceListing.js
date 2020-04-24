import React from 'react'
import Database from "../Database"

export default class ResourceListing extends React.Component {

    // Passed as props:
    // -moduleName: name of the module the resources are for
    // -moduleId: id of the module

    constructor(props) {
        super(props)

        this.state = {
            gotLink: false,
            resources: []
        }

        this.view = this.view.bind(this)
    }

    view() {
        var tempThis = this

        let onSuccess = function(result) {
            for (let i = 0; i < result.length; i++) {
                let name = ""
                for (let j = 0; j < result[i].length; j++) {
                    if (!result[i].substring(j).includes("/")) {
                        name = result[i].substring(j)
                        break;
                    }
                }

                tempThis.state.resources.push(
                    <div key={i}>
                        <a href={result[i]} download="Resource"> {name} </a>
                    </div>
                )
            }

            tempThis.setState({gotLink: true})
        }

        let onFailure = function(error) {
            tempThis.state.resources.push(
                    <div key={1}>
                        No resources for this module.
                    </div>
            )

            tempThis.setState({gotLink: true})
        }

        Database.getModuleResources(this.props.moduleId, onSuccess, onFailure)
    }

    render() {
        return (
            <div style={{marginBottom:"1vh"}} onClick={this.view.bind(this)}>
                <h5> Click to view resources for {this.props.moduleName} </h5>

                {this.state.gotLink ? this.state.resources : null}
            </div>
        )
    }
}