import React from 'react';

import Avatar from './Avatar';
import Stats from './Stats';
import Moves from './Moves';
import Perfectness from './Perfectness';

class Detail extends React.Component {
	constructor(props) {
		super(props);

		// binds
	}



	render() {
		const {
			props: { pokemon }
		} = this;


		return(
			<div className="pokemon-wrap card hoverable" onClick={this.props.onPokemonSelected.bind(this , pokemon)}>
				<Perfectness
					individual_attack={pokemon.individual_attack}
					individual_defense={pokemon.individual_defense}
					individual_stamina={pokemon.individual_stamina}
					cp={pokemon.cp}
				/>

				<Avatar
					name={pokemon.nickname ? pokemon.nickname : pokemon.name}
					img={pokemon.img}
					cp={pokemon.cp}
				/>



			</div>	
		);			
	}
}

Detail.Proptypes = {
	pokemon: React.PropTypes.object.isRequired,
} 

export default Detail; 

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