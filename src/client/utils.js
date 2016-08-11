import pokemons from './pokemons.json'
import skills from './skills.json'
import cookie from 'react-cookie'

const LEVELS = [ 0.094     ,  0.16639787,  0.21573247,  0.25572005,  0.29024988,
    0.3210876 ,  0.34921268,  0.37523559,  0.39956728,  0.42250001,
    0.44310755,  0.46279839,  0.48168495,  0.49985844,  0.51739395,
    0.53435433,  0.55079269,  0.56675452,  0.58227891,  0.59740001,
    0.61215729,  0.62656713,  0.64065295,  0.65443563,  0.667934  ,
    0.68116492,  0.69414365,  0.70688421,  0.71939909,  0.7317    ,
    0.73776948,  0.74378943,  0.74976104,  0.75568551,  0.76156384,
    0.76739717,  0.7731865 ,  0.77893275,  0.78463697,  0.79030001];

export function getLevelByCPMultiplier(cpMulitiplier)
{
    for (var i = 0; i < LEVELS.length; i ++)
    {
        if (Math.abs(LEVELS[i] - cpMulitiplier) < 0.01)
            return (i + 1);
    }

    return 1;
}


var pokemonHash = {};
var skillHash = {};

for (var i in pokemons)
{
    pokemonHash[pokemons[i].id] = pokemons[i];
}

for (var i in skills.normal)
{
    skills.normal[i].class = "fast";
    skillHash[skills.normal[i].name.toLowerCase().replace(/\s/ , '')] = skills.normal[i];
}

for (var i in skills.special)
{
    skills.special[i].class = "special";
    skillHash[skills.special[i].name.toLowerCase().replace(/\s/ , '')] = skills.special[i];
}


export function getPokemonDefById(id)
{
    return pokemonHash[id];
}

export function getSkillDefByName(name)
{
    return skillHash[name];
}

function createSkillObject(pokemonDef ,pokemon , skillname)
{

    var object = Object.assign({} , getSkillDefByName(skillname));
    object.learnt = false;

    // Get the STAB
    object.stab = pokemonDef.types.indexOf(object.type) >= 0;

    object.dps = getDPS(object);

    // Debug the Pinsir bug
    if (pokemon.move_2_name.indexOf("cissor") > 0)
    {
        console.log(pokemon.move_2_name);
    }


    if (pokemon.move_1_name.replace("_FAST" , '').toLowerCase().replace(/[\s_]/g , '') === skillname ||
        pokemon.move_2_name.replace("_FAST" , '').toLowerCase().replace(/[\s_]/g , '') === skillname)
    {
        object.learnt = true;
    }

    return object;

}

export function getSkillsByPokemon(pokemon)
{

    var pokemonDef = getPokemonDefById(pokemon.pokemon_id);
    var skills = {
        fast_attacks : pokemonDef.normal_skills.map( skill => createSkillObject(pokemonDef , pokemon , skill)),
        special_attacks : pokemonDef.special_skills.map(skill => createSkillObject(pokemonDef ,pokemon , skill))
    }

    skills.fast_attacks.sort(sort);
    skills.special_attacks.sort(sort);

    return skills;

}

function sort(a , b){
    return b.dps - a.dps;
}

function getDPS(skill)
{
    var crit = skill.critical || 0;

    return skill.damage * (crit * 1.5 + (1- crit) * 1) *(skill.stab ? 1.25 : 1.0) / (skill.class === "fast" ? skill.cooldown : skill.duration);
}


export function isMobile()
{
    return getScreenSize().width < 500;
}

function getScreenSize()
{
    return {
        width :  screen.width,
        height : screen.height
    }
}



export function loadStateFromCookie(key , defaultValue)
{
    var state = cookie.load(key);
    if (state === undefined)
    {
        return defaultValue;
    }
    return state;
}

export function saveStateToCookie(key , value)
{
    cookie.save(key , JSON.stringify(value) , { path: '/' });
}