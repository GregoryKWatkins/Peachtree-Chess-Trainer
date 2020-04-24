import React from 'react'
import Database from "../Database"

import {GreenButton, RedButton} from "../Stylesheets/components/Modals/ModuleSettingsModalStyling"

export default class ResourceUploader extends React.Component {

    // Passed as props
    // selectedModuleName: the name of module we are creating this resource for
    // selectedModuleId: the id of module we are creating this resource for

    constructor(props) {
        super(props)

        this.state = {
            gotLink: false,
            resources: [],
            selectedFile: null
        }

        this.view = this.view.bind(this)
        this.upload= this.upload.bind(this)
        this.onFileChange= this.onFileChange.bind(this)
        this.deletion = this.deletion.bind(this)

        this.view()
    }

    // On file select (from the pop up)
    onFileChange = event => {
      let file = event.target.files[0]
      if (file === undefined) {
          alert("File not found")
          return
      }
      if (file.size > 4000000) {
          alert("File exceeds maximum size allowed.")

      } else {
          // Update the state
          this.setState({ selectedFile: file});
      }
    };

    deletion(name) {
        let tempThis = this

        let onSuccess = function(result) {
            tempThis.setState({gotLink: false, resources: []})
            tempThis.view()
        }

        let onFailure = function(error) {
            console.log("Error: " + error)
        }

        Database.deleteResource(name.substring(0, name.length - 4), this.props.selectedModuleId, onSuccess, onFailure)
    }

    view() {
        let tempThis = this

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
                    <div style={{marginBottom: "1vh"}} key={i}>
                        <a href={result[i]} download="Resource"> {name} </a>
                        <RedButton onClick={tempThis.deletion.bind(this, name)}> Delete Resource </RedButton>
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

        Database.getModuleResources(this.props.selectedModuleId, onSuccess, onFailure)
    }

    upload() {
        alert("Uploading file. Please wait for notification of success.")
        let tempThis = this
        let onSuccess = function(result) {
            alert("Upload Successful")
            tempThis.setState({selectedFile: null, gotLink: false, resources: []})
            tempThis.view()
        }

        let onFailure = function(error) {
            alert("Error: Failed to upload file")
            console.log("Error: " + error)
        }

        Database.uploadResource(this.state.selectedFile, this.props.selectedModuleId, onSuccess, onFailure)
    }

    render() {
        return (
            <div>
                <h4> {this.props.selectedModuleName}</h4>
                <p>Here you may upload PDF documents for your coaches to download.</p>
                <p>Each document must be under 4 MB in size to upload.</p>

                {this.state.gotLink ? this.state.resources : <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="loading"/> }

                <input type="file" onChange={this.onFileChange}/>

                {((this.state.selectedFile !== null) && (this.state.selectedFile !== undefined)) ?
                    <GreenButton onClick={this.upload}> Upload Resource </GreenButton>
                    : null}

            </div>
        )
    }
}