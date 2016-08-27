import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { browserHistory } from 'react-router';
import { Row , FormControl , Checkbox , FormGroup , Button , Table } from 'react-bootstrap';
import {SuggestedMoveTitle , SuggestedMove } from './Detail/SuggestedMove.jsx'
import Select from 'react-select';


import * as utils from '../../utils'

class PokemonNew extends React.Component {
	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);


		this.state = {
			pId: 130,
			cp : 1930,
			hp : 138,
			dust : 4000,
			attack: false,
			defense : false,
			stamina : false,
			appraiseIndex : 0,
			team : "red" ,
			possibleIVs : []
		};
	}

	onPokemonChanged(val)
	{
		this.setState({pId : val.value});
	}

	onDustChanged(val)
	{
		this.setState({dust : val.value});
	}

	onHPChanged(evt)
	{
		this.setState({hp : parseInt(evt.target.value)});
	}

	onCPChanged(evt)
	{
		this.setState({cp : parseInt(evt.target.value)});
	}

	onCheckboxChanged(type , evt)
	{
		var state = this.state;
		state[type] = evt.target.checked;
		this.setState(state);
	}

	onFieldFocus(type , evt)
	{
		var state = this.state;
		state[type] = '';
		evt.target.value = ''
		this.setState(state);

	}

	onAppraiseChanged(val)
	{
		this.setState({appraiseIndex: val.value})
	}

	onCalculateButtonPressed()
	{
		const { pId , cp , hp , dust, team ,
			defense , attack , stamina , appraiseIndex
			} = this.state;

		const possibleIVs = utils.calculateIV(pId , cp , hp , dust);


		let finalizedIVs = [];

		for (var i in possibleIVs)
		{
			var max = Math.max(possibleIVs[i].atk , Math.max(possibleIVs[i].def , possibleIVs[i].hp));
			if ((attack ) == (possibleIVs[i].atk === max) &&
				(defense ) == (possibleIVs[i].def === max) &&
				(stamina ) == (possibleIVs[i].hp === max) )
			{
				var appraiseMaxes = utils.getAppraiseFromIndex(appraiseIndex).stats;
				if (appraiseMaxes.indexOf(max) >= 0)
					finalizedIVs.push(possibleIVs[i]);
			}
		}

		this.setState({possibleIVs : finalizedIVs});
	}

	render() {
		const { pId , cp , hp , dust, team ,
			defense , attack , stamina , appraiseIndex , possibleIVs
			} = this.state;


		//test();

		const ivTable = possibleIVs.length == 0 ? '' :
			(<div >
				<Table className="iv-table" bordered striped condensed hover>
					<thead>
						<th>Perfection</th>
						<th>Attack</th>
						<th>Defense</th>
						<th>Stamina</th>
					</thead>
					<tbody>
					{
						possibleIVs.map( (iv , index) =>
							<tr key={"iv_" + index}>
								<td>
									{Math.round(100 * (iv.atk + iv.def + iv.hp)/45) + '%'}
								</td>
								<td>
									{iv.atk}
								</td>
								<td>
									{iv.def}
								</td>
								<td>
									{iv.hp}
								</td>
							</tr>
						)
					}
					</tbody>
				</Table>

			</div>)


		const col = 2997 - (((pId - 1) % 31)) * 96;
		const row = 2565 - 96 * (((pId - 1) / 31 ) | 0 );

		// Create dummy object for reuse.
		// TODO: refactor this

		const pokemon = {
			pokemon_id : pId
		}
		const pokemonIcon = {
			width : 96,
			height : 96,
			background : 'url(assets/pokemons.png) ' + col + 'px ' + row + 'px',
			marginLeft : 'auto',
			marginRight : 'auto'
		}
		return (
			<div className="pokemon">
				<div className="row">
					<label className="col-xs-3 input-label">Pokemon</label>
					<div className="col-xs-8">
						<Select
							name="pId"
							value={pId}
							options={utils.getPokemonList()}
							onChange={this.onPokemonChanged.bind(this)}
						/>
					</div>
				</div>
				<div className="row">
					<label className="col-xs-3 input-label">Stardust</label>
					<div className="col-xs-8">
						<Select
							name="dust"
							value={dust}
							options={utils.getDustList()}
							onChange={this.onDustChanged.bind(this)}
						/>
					</div>
				</div>
				<div className="row">
					<label className="col-xs-3 input-label">HP</label>
					<div className="col-xs-8">
						<FormControl defaultValue={hp} onFocus={this.onFieldFocus.bind(this , 'hp')} onBlur={this.onHPChanged.bind(this)}></FormControl>
					</div>
				</div>

				<div className="row">
					<label className="col-xs-3 input-label">CP</label>
					<div className="col-xs-8">
						<FormControl defaultValue={cp} onFocus={this.onFieldFocus.bind(this , 'cp')} onBlur={this.onCPChanged.bind(this)}></FormControl>
					</div>
				</div>

				<div className="row">
					<label className="col-xs-3 input-label">Appraise</label>
					<div className="col-xs-8">
						<Select
							name="appraise"
							options={utils.getAppraiseList(team)}
							value={appraiseIndex}
							onChange={this.onAppraiseChanged.bind(this)}
						/>
					</div>
				</div>

				<div className="row">
					<div className="col-xs-3 input-label"></div>
					<div className="col-xs-8">
						<FormGroup>
							<Checkbox defaultChecked={attack} onChange={this.onCheckboxChanged.bind(this , 'attack')} inline>
								ATTACK
							</Checkbox>
						</FormGroup>
					</div>
				</div>
				<div className="row">
					<div className="col-xs-3 input-label"></div>
					<div className="col-xs-8">
						<FormGroup>
							<Checkbox defaultChecked={defense} onChange={this.onCheckboxChanged.bind(this , 'defense')} inline>
								Defense
							</Checkbox>
						</FormGroup>
					</div>
				</div>
				<div className="row">
					<div className="col-xs-3 input-label"></div>
					<div className="col-xs-8">
						<FormGroup>
							<Checkbox defaultChecked={stamina} onChange={this.onCheckboxChanged.bind(this , 'stamina')} inline>
								Stamina
							</Checkbox>
						</FormGroup>
					</div>
				</div>
				<div className="row">
					<div className="col-xs-3 input-label"></div>
					<div className="col-xs-8">
						<Button bsStyle="success" onClick={this.onCalculateButtonPressed.bind(this)}>
							Calculate
						</Button>
					</div>
				</div>
				<div className="row">
					<div style={pokemonIcon}></div>
				</div>
				{
					ivTable
				}
				<Table striped bordered style={{width : '80%' , margin : 'auto'}}>
					<SuggestedMoveTitle />
					<SuggestedMove pokemon={pokemon} />
				</Table>
			</div>

		)
	}
}

export default PokemonNew;


function test(){
	//const possibleIV = utils.calculateIV(pId , cp , hp , dust);
	// Test
	var success = 0;

	var dataSet = [
		[73 , 1201 , 102 , 3000 , 4 , 6 , 8],
		[130 , 1930 , 138 , 4000 , 12 , 15 , 15],
		[130 , 1665 , 122 , 3000 , 15 , 11 , 4],
	]
	for (var i in dataSet)
	{
		var results = utils.calculateIV(dataSet[i][0], dataSet[i][1] ,
			dataSet[i][2] , dataSet[i][3]);
		for (var j in results)
		{
			if (results[j].atk === dataSet[i][4] &&
				results[j].def === dataSet[i][5] &&
				results[j].hp === dataSet[i][6])
			{
				success ++;
				break;
			}
		}
	}
	console.log(success + "/" + dataSet.length)
}