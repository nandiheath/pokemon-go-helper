import React from 'react';

import Avatar from './Avatar';
import Stats from './Stats';
import Moves from './Moves';
import { Skill , SkillTitle } from './Skill';
import { SuggestedMove , SuggestedMoveTitle } from './SuggestedMove'
import Type from './Type';
import TextTooltip from './TextTooltip'

import Perfectness from './Perfectness';
import { Row  , Table } from 'react-bootstrap'

import { isMobile , getLevelByCPMultiplier , getSkillsByPokemon , getPokemonDefById , getSkillDefByName,
	getDoubleAttackTo , getDoubleAttackFrom , getDefTypesRelationship , formatSkillName , getHalfAttackTo ,
	getUnsignedLong
} from './../../../utils'



class Summary extends React.Component {
	constructor(props) {
		super(props);

		// binds

	}



	render() {
		const {
			props: { pokemon }
		} = this;

		const maxPower = 45;
		const perfectLevel = (((pokemon.individual_attack + pokemon.individual_defense + pokemon.individual_stamina) / maxPower) * 100).toFixed(0);
		// Calculate the level using this formula
		// HP = (Base Stam + Stam IV) * Lvl(CPScalar)

		var skills = getSkillsByPokemon(pokemon);

		const pokemonDef = getPokemonDefById(pokemon.pokemon_id);
		const fastSkillDef = getSkillDefByName(formatSkillName(pokemon.move_1_name));
		const specialSkillDef = getSkillDefByName(formatSkillName(pokemon.move_2_name));


		const fastAtk_1_5 = pokemonDef.types.indexOf(fastSkillDef.type) >= 0 ? getDoubleAttackTo(fastSkillDef.type) : []
		const fastAtk_1_25 = pokemonDef.types.indexOf(fastSkillDef.type) >= 0 ? [] : getDoubleAttackTo(fastSkillDef.type);
		const specialAtk_1_5 = pokemonDef.types.indexOf(specialSkillDef.type) >= 0 ? getDoubleAttackTo(specialSkillDef.type) : []
		const specialAtk_1_25 = pokemonDef.types.indexOf(specialSkillDef.type) >= 0 ? [] : getDoubleAttackTo(specialSkillDef.type);

		const defenseBonus = getDefTypesRelationship(pokemonDef.types);
		const columnStyle = {
			width : '45%'
		}

		const columnAlignStyle = {
			textAlign : isMobile() ? 'center' : 'left',
		}

		const columnHeaderSpanStyle = {
			float: isMobile() ? 'none' : 'left',
			fontSize: isMobile() ? 'small' : 'medium'
		}

		return(
			<div className="summary">

				<div className="pokemon-type">
					<Type size={50} types={pokemonDef.types} />
				</div>

				<span className="summary-text-cp">{pokemon.cp}</span>
				<img className="summary-image" src={pokemon.img} />
				<span className="summary-text-name">{pokemon.nickname == "" ? pokemon.name : pokemon.nickname}</span>
				<span> Caught { getCapturedDays(pokemon.creation_time_ms) } ago </span>

				<div className="card">
					<div className="summary-stat-wrap">
						<div className="summary-stat-text">HP</div>
						<div className="summary-stat-body">{pokemon.stamina_max}</div>
					</div>
					<div className="summary-stat-wrap">
						<div className="summary-stat-text">IV<TextTooltip text="Individual value percetage of the pokemon"/></div>
						<div className="summary-stat-body">{perfectLevel + "%"}</div>
					</div>
					<div className="summary-stat-wrap">
						<div className="summary-stat-text">LEVEL</div>
						<div className="summary-stat-body">{getLevelByCPMultiplier(pokemon.cp_multiplier)}</div>
					</div>
					<div className="summary-stat-wrap">
						<div className="summary-stat-text">UP# <TextTooltip text="How many times you have upgraded your pokemon"/></div>
						<div className="summary-stat-body">{pokemon.num_upgrades}</div>
					</div>
				</div>

				<div className="card">
					<div className="summary-stat-wrap">
						<div className="summary-stat-text">ATK</div>
						<div className="summary-stat-body">{pokemon.individual_attack}</div>
					</div>
					<div className="summary-stat-wrap">
						<div className="summary-stat-text">DEF</div>
						<div className="summary-stat-body">{pokemon.individual_defense}</div>
					</div>
					<div className="summary-stat-wrap">
						<div className="summary-stat-text">STA</div>
						<div className="summary-stat-body">{pokemon.individual_stamina}</div>
					</div>
				</div>



				<div className="card skill-card">
					<SkillTitle type="fast" />

					{skills.fast_attacks.map( skill => <Skill key={skill.name} skill={skill} pokemonDef={pokemonDef} /> )}
				</div>


				<div className="card skill-card">
					<SkillTitle type="special"  />
					{skills.special_attacks.map( skill => <Skill key={skill.name} skill={skill} pokemonDef={pokemonDef} /> )}
				</div>

				<div className="card skill-card">
					<SuggestedMoveTitle />
					<SuggestedMove type={pokemonDef.type} pokemon={pokemon} />
				</div>



				<div className="card skill-card">
					<span className="summary-table-title summary-table-title-attack">ATTACK EFFECTIVENESS</span>
					<Table striped bordered condensed hover>
						<thead>
							<tr>
								<th><span className="summary-skill-type-title"></span></th>
								<th style={columnStyle}>
									<div style={columnAlignStyle}>
										<span style={columnHeaderSpanStyle} className='summary-skill-type-title'>{fastSkillDef.name.toUpperCase()}</span>
										{ isMobile()? <br/> : ''}
										<Type size={25} types={[fastSkillDef.type]} />
									</div>
								</th>
								<th style={columnStyle}>
									<div style={columnAlignStyle}>
										<span style={columnHeaderSpanStyle} className='summary-skill-type-title'>{specialSkillDef.name.toUpperCase()}</span>
										{ isMobile()? <br/> : ''}
										<Type size={25} types={[specialSkillDef.type]} />
									</div>
								</th>
							</tr>
						</thead>
						<tbody>
							{
								fastAtk_1_5.length + specialAtk_1_5.length > 0 ?
									<tr>
										<td style={columnAlignStyle}><span className="summary-skill-multiplier summary-table-title-defense">1.5X</span></td>
										<td>{fastAtk_1_5.length > 0 ? <Type size={40} types={fastAtk_1_5} /> : ''}</td>
										<td>{specialAtk_1_5.length > 0 ? <Type size={40} types={specialAtk_1_5} /> : ''}</td>
									</tr>
									: <tr></tr>
							}

							{
								fastAtk_1_25.length + specialAtk_1_25.length > 0 ?
									<tr>
										<td style={columnAlignStyle}><span className="summary-skill-multiplier summary-table-title-defense">1.25X</span></td>
										<td>{fastAtk_1_25.length > 0 ? <Type size={40} types={fastAtk_1_25} /> : ''}</td>
										<td>{specialAtk_1_25.length > 0 ? <Type size={40} types={specialAtk_1_25} /> : ''}</td>
									</tr>
									: <tr></tr>
							}
						<tr>
							<td style={columnAlignStyle}><span className="summary-skill-multiplier summary-table-title-attack">0.8X</span></td>
							<td>{<Type size={40} types={getHalfAttackTo(fastSkillDef.type)} />}</td>
							<td>{<Type size={40} types={getHalfAttackTo(specialSkillDef.type)} />}</td>
						</tr>
						</tbody>
					</Table>
				</div>

				<div className="card skill-card">
					<span className="summary-table-title summary-table-title-defense">DEFENSE EFFECTIVENESS</span>
					<Table striped bordered condensed hover>
						<thead>
							<tr>
								<th></th>
								<th style={Object.assign({width:'90%'} , columnAlignStyle)}>
									<div>
										<span style={columnHeaderSpanStyle} className='summary-skill-type-title'>ATTACK FROM</span>

									</div>
								</th>
							</tr>
						</thead>
						<tbody>
							{
								defenseBonus.map((bonus) =>
									<tr key={"defense_bonus_" + bonus.multiplier}>
										<td style={columnAlignStyle}>
											<span
												className={"summary-skill-multiplier " + (bonus.multiplier > 1 ? "summary-table-title-attack": "summary-table-title-defense")}>
												{bonus.multiplier + "X"}
											</span>
										</td>
										<td><Type size={40} types={bonus.types}/></td>
									</tr>
								)
							}
						</tbody>
					</Table>
				</div>
			</div>	
		);			
	}
}

function getCapturedDays(timeLong)
{
	var intervalMs = new Date().getTime() - timeLong; //getUnsignedLong(timeLong.high , timeLong.low);
	var hours = intervalMs/(1000 * 3600);
	if (hours < 24)
		return hours.toFixed(0) + " hours";

	return (hours / 24).toFixed(0) + " days";
}


Summary.Proptypes = {
	pokemon: React.PropTypes.object.isRequired,
} 

export default Summary;

