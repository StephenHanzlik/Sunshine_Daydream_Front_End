import React, { Component } from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';


const LargeButton = styled.button`
  color: #ffb74d;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #ffb74d;
  border-radius: 3px;
  background: none;
`;

const SmallButton = styled.button`
  color: #ffb74d;
  font-size: 1em;
  padding: 0.3em 0.3em;
  border: 2px solid #ffb74d;
  border-radius: 3px;
`

class Modal extends Component {

    constructor(props){
        super(props);
        this.state = {
            relativeTime:   604800000,
            observationType: 'snowDepth'
        }

        this.handleObservationTypeChange = this.handleObservationTypeChange.bind(this);
        this.handleRelativeTimeChange = this.handleRelativeTimeChange.bind(this);
    }

    handleRelativeTimeChange(event) { 
        this.setState({
            relativeTime: event.target.value
        })
    }

    handleObservationTypeChange(event) { 
        this.setState({
            observationType: event.target.value
        })
    }

    render(){
        // const timeSelectStyle = {
        //     'display': 'initial',
        //     'max-width': '95px',
        //     'margin-top': '-10px'
        // }

        const absoluteTimeStyle = {
            'display': 'inline'
        }
        
        // const showHideStyle = this.props.show ? {display: "block"} : {display: "none"};
        const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";

        return (
            <div className={showHideClassName}>
                <p>You are mounting a graph for {this.props.graphType}.  Select the time interval to graph your chosen data set.</p>
                {/* <section className="modal-main"> */}
                    <form onSubmit={this.handleRelativeTimeSubmit}>
                        <label for="selectObservationType">Observation Type</label>
                        <select name="selectObservationType" value={this.state.observationType} onChange={this.handleObservationTypeChange}>
                            <option value="604800000">Snow Depth</option>
                            <option value="2592000000">Snow Depth Δ</option>
                            <option value="5184000000">Snow Water Equivalent</option>
                            <option value="7776000000">Snow Water Equivalent Δ</option>
                            <option value="31536000000">Air Temperature Observed</option>
                            <option value="31536000000">Air Temperature Average</option>
                            <option value="31536000000">Air Temperature Min</option>
                            <option value="31536000000">Air Temperature Min</option>
                        </select>
                        <label for="selectRelativeTimeInterval">Relative</label>
                        <select name="selectRelativeTimeInterval" value={this.state.relativeTime} onChange={this.handleRelativeTimeChange}>
                            <option value="604800000">7 days</option>
                            <option value="2592000000">30 days</option>
                            <option value="5184000000">60 days</option>
                            <option value="7776000000">90 days</option>
                            <option value="31536000000">365 days</option>
                        </select>
                        <label for="selectStartDate">Start Date:</label>
                        <input type="text" onChange={this.handleAbsoluteStartChange} value={this.state.startDate} name="selectStartDate"/>
                        <label for="selectEndDate">End Date:</label>
                        <input type="text" onChange={this.handleAbsoluteEndChange} value={this.state.endDate} name="selectEndDate"/>
                        <input type="submit" value="Submit" />
                    </form>
                    {/* <form onSubmit={this.handleAbsoluteTimeSubmit}>
                        <label>
                             Start Date: <input type="text" onChange={this.handleAbsoluteStartChange} value={this.state.startDate} name="startDate"/>
                        </label>
                        <label>
                             End Date: <input type="text" onChange={this.handleAbsoluteEndChange} value={this.state.endDate} name="endDate"/>
                        </label>
                        <input type="submit" value="Submit" />
                    </form> */}
                {/* </section> */}
                <button onClick={() => this.props.closeModal()}>Cancel</button>
          </div>
        )
    }
}

export default Modal;
