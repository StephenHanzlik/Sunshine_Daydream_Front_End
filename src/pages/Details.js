import React, { Component } from 'react';
import NavBar from '../components/NavBar';
import Map from '../components/Map';
import ArrowButton from '../components/ArrowButton';
import Button from '../components/Button';
import Graph from '../components/Graph';
import GeoJsonFeatureCollection from '../classes/geoJsonFeatureCollection'; 
import GeoJsonFeature from '../classes/geoJsonFeature'; 
import styled from 'styled-components';
import axios from 'axios';

const MapWrapper = styled.div`
    background: red;
`;

const DataWrapper = styled.div`
    height: 10px;
`;

const Row = styled.div`
    display: flex;
    justify-content: center;
`;

class Details extends Component{

    constructor(props) {
        super(props);
        this.state = {
            stationTriplet: '',
            stationName: '',
            stationElevation: '',
            lat: '',
            lng: '',
            geoJson: '',
            observations: '',
            currentObservationIndex: '',
            mountGraph: false
        };
    }

    componentDidMount(){
        //currently setting station observations to state but not triplet
        //TODO: Should also configure zoom and center as props to map
        let stationTriplet = this.getStationTriplet();
        this.getStation(stationTriplet);
        this.getStations();
        this.getObservations(stationTriplet);
    }

    //TODO:  Impliment redux to reduce API calls
    getStationTriplet(){
        let url = window.location.href;
        return url.slice(url.indexOf("details/") + 8);
    }

    getStation(triplet){
        axios.get(`/api/snotel/stations/${triplet}`)
        .then(response => {
             let observation = response.data[0];
            //  let stationGeoJson = this.convertToGeoJson(response.data);
             this.setState({
                stationTriplet: observation.triplet,
                stationName: observation.name,
                stationElevation: observation.elevation,
                lat: JSON.parse(observation.location).lat,
                lng: JSON.parse(observation.location).lng,
                // geoJson: stationGeoJson
             })
        })
         .catch(error => console.log(error))
    }

    getStations(){
        axios.get('/api/snotel/stations')
            .then(response => {
                let stationGeoJson = this.convertToGeoJson(response.data);
                this.setState({
                 geoJson: stationGeoJson
             })
         })
            .catch(error => console.log(error)) 
    }

    getObservations(triplet){
        axios.get(`/api/snotel/observations/${triplet}?from=2020-6-01&to=${new Date().toJSON().slice(0,10)}`)
        .then(response => {
            this.setState({
                observations: response.data,
                currentObservationIndex: response.data.length - 1
            })
        })
        .catch(error => console.log(error))
    }

    convertToGeoJson(stations) {

        let geoJsonFeatureCollection = new GeoJsonFeatureCollection();
        
        stations.forEach(station => {
            let location = JSON.parse(station.location);
            let geoJsonFeature = new GeoJsonFeature(location.lng, location.lat, station.name, station.elevation, station.triplet, station.timezone, station.wind);
            console.log("geoJsonFeature - details: ", geoJsonFeature);
            geoJsonFeatureCollection.data.features.push(geoJsonFeature);
        })

        return geoJsonFeatureCollection;
    };

    previousObservation(){
        const currentIndex = this.state.currentObservationIndex;
        if(currentIndex > 0){
            let newIndex = currentIndex - 1;
            this.setState({
                currentObservationIndex: newIndex
            })
        }else{
            //TODO:  Nicer notifactions.  Prompt user to graph for more historical data.
            alert("You are on the last item.  Use Graph for more historical data.");
        }
    }

    nextObservation(){
        const currentIndex = this.state.currentObservationIndex;
        if(currentIndex < this.state.observations.length - 1){
            let newIndex = currentIndex + 1;
            this.setState({
                currentObservationIndex: newIndex
            })
        }else{
            //TODO:  Nicer notifactions. 
            alert("You are on the current day.");
        }
    }

    toggleGraph(){
        let mountGraph = this.state.mountGraph;
        this.setState({
            mountGraph: !mountGraph
        })
    }

    render(){
        let currentObservation;
        let observations = this.state.observations;
    
        if(observations){
            currentObservation = observations[this.state.currentObservationIndex];
        }

        return(

            <div>{
                 this.state && this.state.geoJson && this.state.observations &&
                <div>
                    <NavBar/>
                    <Row>
                        <MapWrapper>
                            <Map
                                geoJson={this.state.geoJson}
                                lng={this.state.lng}
                                lat={this.state.lat}
                                // lng={this.state.geoJson.data.features[0].geometry.coordinates[0]}
                                // lat={this.state.geoJson.data.features[0].geometry.coordinates[1]}
                                zoom={12}
                                // mapHeight={67}
                                // mapWidth={45}
                                mapHeight={59}
                                mapWidth={30}
                            />
                        </MapWrapper>
                        <DataWrapper>
                            {/* TODO: This could probably be its own component */}
                            <div>
                                <h3>{this.state.stationName}</h3>
                                <h3>{this.state.stationElevation}ft</h3>
                                {/* <div>{this.state.lng}, {this.state.lat}</div>
                                <div>{this.state.stationTriplet }</div> */}
                                <Row>
                                    <div onClick={()=>this.previousObservation("test value 1")}>
                                        <ArrowButton leftArrow={true}/>
                                    </div>
                                    <h5>{currentObservation.date}</h5>
                                    <div onClick={()=>this.nextObservation("test value 2")}>
                                        <ArrowButton rightArrow={true}/>
                                    </div>
                                    
                                </Row>
                                <h5>Snow Depth: {currentObservation.snowDepth}" | Δ: {currentObservation.changeInSnowDepth}"</h5>
                                <h5>Snow Water Equivalent: {currentObservation.snowWaterEquivalent}" | Δ: {currentObservation.changeInSnowWaterEquivalent}"</h5>  
                                {/* { currentObservation.airTemperatureObserved && */}
                                    <h5>Air Temp: {currentObservation.airTemperatureObserved}°F</h5>
                                {/* } */}
                                {/* { currentObservation.airTemperatureAverage && */}
                                    <h5>Air Temp Average: {currentObservation.airTemperatureAverage}°F</h5>
                                {/* } */}
                                {/* { currentObservation.airTemperatureMin && currentObservation.airTemperatureMax && */}
                                    <h5>Air Temp Min: {currentObservation.airTemperatureMin}°F | Air Temp Max: {currentObservation.airTemperatureMax}°F</h5>
                                {/* } */}
                                <div onClick={()=>this.toggleGraph()}   >
                                    <Button/>
                                </div>
                            </div>
                        </DataWrapper>
                    </Row>
                    {this.state.mountGraph &&
                        <Graph
                            observations={this.state.observations}
                         />
                    }

                </div>
            }</div>
        )
    }
}

export default Details;