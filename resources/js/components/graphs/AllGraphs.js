import React from 'react';
import Piechart from "./Piechart";
import PPMLineGraph from "./PPMLineGraph";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Map from "../Map";
import Simulation from '../classes/Simulation';
//import PPMData from '../classes/PPMData';
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
//import MapData from "../classes/MapData";
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import BarChart from './BarChart';
import TextField from '@material-ui/core/TextField';


class AllGraphs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            populationIncrease: 0.0,
            deforestationIncrease: 0.0,
            electricityIncrease: 0.0,
            transportationIncrease: 0.0,
            buildingIncrease: 0.0,
            manufacturingIncrease: 0.0,
            industryIncrease: 0.0,
            agricultureIncrease: 0.0,
            yearToStop: 2020,
            lineGraphData: [{ "Year": 2020, "sumPPM": 0 }, { "Year": 2021, "sumPPM": 0 }, { "Year": 2022, "sumPPM": 0 }],
            mapData: [],
            ppmPieData: [["Country", "PPM"], ["Start a simulation to see results", 100]],
            isFetching: true,
            warning: "",
            inputError: false,
            //barData: [{"country": "Germany", "PPM": 0.0292}, {"country": "France", "PPM": 0.0212}]
            barData: [{ 2020: [{ "country": "Germany", "PPM": 0.0292 }] }]
        }
        this.startSimulation = this.startSimulation.bind(this);
    }

    set simulation(v) {
        this._simulation = v;
    }

    get simulation() {
        return this._simulation;
    }

    componentWillMount() {
        var self = this;
        this.simulation = new Simulation();

        this.simulation.loadCountries('/Csv/countries.csv')
            .then(function () {
                self.updateMapData(self.simulation.initialCountries);

                var barChartInitialData = self.simulation.getPPMByYearByCountry(self.state.yearToStop, self.state.populationIncrease, self.state.deforestationIncrease, self.state.electricityIncrease,
                    self.state.transportationIncrease, self.state.buildingIncrease, self.state.manufacturingIncrease, self.state.industryIncrease,
                    self.state.agricultureIncrease);
                self.updateBarData(barChartInitialData);
            })

    }

    startSimulation() {
        var lineGraphData = this.simulation.getTotalPPMByYear(this.state.yearToStop, this.state.populationIncrease, this.state.deforestationIncrease, this.state.electricityIncrease,
            this.state.transportationIncrease, this.state.buildingIncrease, this.state.manufacturingIncrease, this.state.industryIncrease,
            this.state.agricultureIncrease);
        var barChartData = this.simulation.getPPMByYearByCountry(this.state.yearToStop, this.state.populationIncrease, this.state.deforestationIncrease, this.state.electricityIncrease,
            this.state.transportationIncrease, this.state.buildingIncrease, this.state.manufacturingIncrease, this.state.industryIncrease,
            this.state.agricultureIncrease);
        var mapData = this.simulation.getPPMMap(this.state.yearToStop, this.state.populationIncrease, this.state.deforestationIncrease, this.state.electricityIncrease,
            this.state.transportationIncrease, this.state.buildingIncrease, this.state.manufacturingIncrease, this.state.industryIncrease,
            this.state.agricultureIncrease);

        this.updateLineGraphData(lineGraphData);
        this.updateBarData(barChartData);
        this.updateMapData(mapData);
    }

    //Update populationIncrease input
    updatePopulationInput(evt) {
        this.setState({
            populationIncrease: +evt.target.value

        })

    }

    //Update deforestation input
    updateDeforestationInput(evt) {
        this.setState({
            deforestationIncrease: +evt.target.value
        })
    }
    updateElectricityInput(evt) {
        this.setState({
            electricityIncrease: +evt.target.value
        })
    }
    updateTransportationInput(evt) {
        this.setState({
            transportationIncrease: +evt.target.value
        })
    }
    updateBuildingInput(evt) {
        this.setState({
            buildingIncrease: +evt.target.value
        })
    }
    updateManufacturingInput(evt) {
        this.setState({
            manufacturingIncrease: +evt.target.value
        })
    }
    updateIndustryInput(evt) {
        this.setState({
            industryIncrease: +evt.target.value
        })
    }
    updateAgricultureInput(evt) {
        this.setState({
            agricultureIncrease: +evt.target.value
        })
    }


    //Update year input
    updateYearInput(evt) {
        if (+evt.target.value >= 2021) {
            this.setState({
                yearToStop: +evt.target.value,
                inputError: false
            },() => {this.setState({warning: "Current chosen year: " + this.state.yearToStop})})
        } else {
            this.setState({
                warning: "Please provide an year after 2021.",
                inputError: true
            })
        }
    }

    //Update LineChart state
    updateLineGraphData(data) {
        this.setState({
            lineGraphData: data
        })
    }

    updateBarData(data) {
        this.setState({
            barData: data
        })
    }
    //update Piechart data
    updatePpmPieData(data, lastYear) {
        this.setState({
            ppmPieData: data,
        })
    }

    //update map data state
    updateMapData(data) {
        this.setState({
            mapData: data,
            isFetching: false
        })
    }

    //Entry point for launching the simulation

    render() {
        return (<div className="App">
            <Row className="m-3 text-center">
                <Col md="3" className="border border-primary rounded p-3">

                    <TextField className="m-2" placeholder={this.state.deforestationIncrease.toString()} label="Deforestation %" variant="outlined" onChange={evt =>
                        this.updateDeforestationInput(evt)} fullWidth/>

                    <TextField className="m-2" placeholder={this.state.populationIncrease.toString()} label="Population increase %" variant="outlined" onChange={evt =>
                        this.updatePopulationInput(evt)} fullWidth/>

                    <TextField className="m-2" placeholder={this.state.electricityIncrease.toString()} label="Electricity increase %" variant="outlined" onChange={evt =>
                        this.updateElectricityInput(evt)} fullWidth/>

                    <TextField className="m-2" placeholder={this.state.transportationIncrease.toString()} label="Transportation increase %" variant="outlined" onChange={evt =>
                        this.updateTransportationInput(evt)} fullWidth/>

                    <TextField className="m-2" placeholder={this.state.buildingIncrease.toString()} label="Building increase %" variant="outlined" onChange={evt =>
                        this.updateBuildingInput(evt)} fullWidth/>

                    <TextField className="m-2" placeholder={this.state.manufacturingIncrease.toString()} label="Manufacturing increase %" variant="outlined" onChange={evt =>
                        this.updateManufacturingInput(evt)} fullWidth/>

                    <TextField className="m-2" placeholder={this.state.agricultureIncrease.toString()} label="Agriculture increase %" variant="outlined" onChange={evt =>
                        this.updateAgricultureInput(evt)} fullWidth/>

                    <TextField className="m-2 mb-3" placeholder={this.state.yearToStop.toString()} label="Year to stop simulation" variant="outlined" onChange={evt =>
                        this.updateYearInput(evt)} fullWidth helperText={this.state.warning} error={this.state.inputError}/>

                    <Button variant="primary" id="buttonStartSim"
                        onClick={this.startSimulation}>Make a simulation</Button>

                </Col>
                <Col md="9">{this.state.isFetching ? <h3 className="text-center justify-content-center align-self-center">Loading map<br /><Spinner animation="grow"></Spinner><Spinner animation="grow"></Spinner><Spinner animation="grow"></Spinner></h3> : <Map data={this.state.mapData} />}</Col>
            </Row>

            <Alert variant='primary' className='m-3'>
                <Alert.Heading className='m-2'>Charts</Alert.Heading>
                <Row className="m-1 justify-content-center">
                    <Col md="12" className="mt-3">
                        {this.state.isFetching ? <h1>Loading</h1> : <BarChart data={this.state.barData} />}
                    </Col>

                </Row>
                <Row className="m-1 justify-content-center">
                    <Col md="6" className="text-center mt-3">
                        {/* <Piechart data={this.state.ppmPieData}/> */}
                    </Col>
                    <Col md="6" className="text-center mt-3">
                        <PPMLineGraph data={this.state.lineGraphData} />
                    </Col>
                </Row>

            </Alert>

        </div>
        )
    }
}

// function AllGraphs() {
//     return (
//         <div>
//
//
//
//
//         </div>
//     );
// }

export default AllGraphs;