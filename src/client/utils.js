import pokemons from './pokemons.json'
import skills from './skills.json'
import types from './types.json'

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


/**
 * Load content into hash
 * @type {{}}
 */


var pokemonHash = {};
var skillHash = {};
var typeHash = {};

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

for (var i in types.types)
{
    typeHash[types.types[i].name] = types.types[i].damage_relations;
}

console.log(typeHash);


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


    if (formatSkillName(pokemon.move_1_name) === skillname ||
        formatSkillName(pokemon.move_2_name) === skillname)
    {
        object.learnt = true;
    }

    return object;
}

export function formatSkillName(name) {
    return name.replace("_FAST", '').toLowerCase().replace(/[\s_]/g, '')
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

export function getDoubleAttackTo(type)
{
    return typeHash[type].double_damage_to.map(obj => obj.name)
}

export function getDoubleAttackFrom(type)
{
    return typeHash[type].double_damage_from.map(obj => obj.name)
}

export function getHalfAttackTo(type)
{
    return typeHash[type].half_damage_to.map(obj => obj.name).concat(typeHash[type].no_damage_to.map(obj => obj.name))
}

export function getHalfAttackFrom(type)
{
    return typeHash[type].half_damage_from.map(obj => obj.name).concat(typeHash[type].no_damage_from.map(obj => obj.name))
}

export function getDefTypesRelationship(types)
{
    var hash = {};

    for (var i in types)
    {
        getHalfAttackFrom(types[i]).map( type => {
            if (hash[type] === undefined)
            {
                hash[type] = 1;
            }

            hash[type] *= 0.8;
        });

        getDoubleAttackFrom(types[i]).map( type => {

            if (hash[type] === undefined)
            {
                hash[type] = 1;
            }

            hash[type] *= 1.25;
        });
    }

    var returnHash = {}

    for (var type in hash)
    {
        var multiplier = (Math.round(hash[type] * 100 ) / 100).toString();

        // Ignore 1X
        if (multiplier === "1")
            continue;

        if (returnHash[multiplier] === undefined)
            returnHash[multiplier] = [];

        returnHash[multiplier].push(type);
    }

    var returnArray = [];
    for (var i in returnHash)
    {
        if (MultiplierMap[i] === undefined)
        {
            continue;
        }

        returnArray.push({
            multiplier : MultiplierMap[i],
            types : returnHash[i]
        })
    }

    returnArray.sort( (a , b) => {
        return a.multiplier - b.multiplier;
    })
    return returnArray;
}

const MultiplierMap = {
    "0.64" : 0.6,
    "0.8" : 0.8,
    "1.25" : 1.25,
    "1.56" : 1.5
}

export function getUnsignedLong(high , low)
{
    var x = new Number(high);
    x *= Math.pow(2 , 32);
    x += low >>> 0 ;
    return x;
}