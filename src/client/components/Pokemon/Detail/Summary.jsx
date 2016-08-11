import React from 'react';

import Avatar from './Avatar';
import Stats from './Stats';
import Moves from './Moves';
import Skill from './Skill';
import SkillTitle from './SkillTitle';
import Type from './Type';

import Perfectness from './Perfectness';
import { Row } from 'react-bootstrap'

import { getLevelByCPMultiplier , getSkillsByPokemon , getPokemonDefById } from './../../../utils'



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
						<div className="summary-stat-text">IV</div>
						<div className="summary-stat-body">{perfectLevel + "%"}</div>
					</div>
					<div className="summary-stat-wrap">
						<div className="summary-stat-text">LEVEL</div>
						<div className="summary-stat-body">{getLevelByCPMultiplier(pokemon.cp_multiplier)}</div>
					</div>
					<div className="summary-stat-wrap">
						<div className="summary-stat-text">UP#</div>
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
					<SkillTitle type="special" />
					{skills.special_attacks.map( skill => <Skill key={skill.name} skill={skill} pokemonDef={pokemonDef} /> )}
				</div>

			</div>	
		);			
	}
}

function getCapturedDays(timeLong)
{
	var intervalMs = new Date().getTime() - getUnsignedLong(timeLong.high , timeLong.low);
	var hours = intervalMs/(1000 * 3600);
	if (hours < 24)
		return hours.toFixed(0) + " hours";

	return (hours / 24).toFixed(0) + " days";
}

function getUnsignedLong(high , low)
{
	var x = new Number(high);
	x *= Math.pow(2 , 32);
	x += low;

	return x;
}
Summary.Proptypes = {
	pokemon: React.PropTypes.object.isRequired,
} 

export default Summary;

/**
 * <Stats
 cp={pokemon.cp}
 stamina_max={pokemon.stamina_max}
 height_m={pokemon.height_m}
 weight_kg={pokemon.weight_kg}
 individual_attack={pokemon.individual_attack}
 individual_defense={pokemon.individual_defense}
 individual_stamina={pokemon.individual_stamina}
 cp_multiplier={pokemon.cp_multiplier}
 num_upgrades={pokemon.num_upgrades}
 additional_cp_multiplier={pokemon.additional_cp_multiplier}
 />


 <Moves
 move_1={pokemon.move_1_name}
 move_2={pokemon.move_2_name}
 />
 */