"""Position inference service for determining player roles."""

from app.schemas.analysis import Position

# Summoner spell ID for Smite
SMITE_SPELL_ID = 11

# Champion ID to typical position mapping
# Based on most common played positions for each champion
CHAMPION_POSITIONS: dict[int, Position] = {
    # TOP laners
    1: Position.MID,      # Annie (also support)
    2: Position.TOP,      # Olaf (also jungle)
    3: Position.MID,      # Galio (also support)
    4: Position.MID,      # Twisted Fate
    5: Position.JUNGLE,   # Xin Zhao
    6: Position.TOP,      # Urgot
    7: Position.MID,      # LeBlanc
    8: Position.MID,      # Vladimir (also top)
    9: Position.JUNGLE,   # Fiddlesticks (also support)
    10: Position.TOP,     # Kayle
    11: Position.JUNGLE,  # Master Yi
    12: Position.SUPPORT, # Alistar
    13: Position.MID,     # Ryze
    14: Position.TOP,     # Sion
    15: Position.BOT,     # Sivir
    16: Position.SUPPORT, # Soraka
    17: Position.TOP,     # Teemo
    18: Position.BOT,     # Tristana
    19: Position.JUNGLE,  # Warwick
    20: Position.JUNGLE,  # Nunu & Willump
    21: Position.BOT,     # Miss Fortune
    22: Position.BOT,     # Ashe
    23: Position.TOP,     # Tryndamere
    24: Position.TOP,     # Jax (also jungle)
    25: Position.SUPPORT, # Morgana (also mid)
    26: Position.SUPPORT, # Zilean
    27: Position.TOP,     # Singed
    28: Position.JUNGLE,  # Evelynn
    29: Position.BOT,     # Twitch
    30: Position.MID,     # Karthus (also jungle)
    31: Position.TOP,     # Cho'Gath
    32: Position.JUNGLE,  # Amumu
    33: Position.JUNGLE,  # Rammus
    34: Position.MID,     # Anivia
    35: Position.JUNGLE,  # Shaco
    36: Position.TOP,     # Dr. Mundo (also jungle)
    37: Position.SUPPORT, # Sona
    38: Position.MID,     # Kassadin
    39: Position.TOP,     # Irelia (also mid)
    40: Position.SUPPORT, # Janna
    41: Position.TOP,     # Gangplank
    42: Position.MID,     # Corki (also bot)
    43: Position.SUPPORT, # Karma (also mid)
    44: Position.SUPPORT, # Taric
    45: Position.MID,     # Veigar
    48: Position.TOP,     # Trundle (also jungle)
    50: Position.MID,     # Swain (also support)
    51: Position.BOT,     # Caitlyn
    53: Position.SUPPORT, # Blitzcrank
    54: Position.TOP,     # Malphite (also support)
    55: Position.MID,     # Katarina
    56: Position.JUNGLE,  # Nocturne
    57: Position.TOP,     # Maokai (also support)
    58: Position.TOP,     # Renekton
    59: Position.JUNGLE,  # Jarvan IV
    60: Position.JUNGLE,  # Elise
    61: Position.MID,     # Orianna
    62: Position.JUNGLE,  # Wukong (also top)
    63: Position.SUPPORT, # Brand (also mid)
    64: Position.JUNGLE,  # Lee Sin
    67: Position.BOT,     # Vayne (also top)
    68: Position.TOP,     # Rumble
    69: Position.MID,     # Cassiopeia
    72: Position.JUNGLE,  # Skarner
    74: Position.MID,     # Heimerdinger (also top)
    75: Position.TOP,     # Nasus
    76: Position.JUNGLE,  # Nidalee
    77: Position.JUNGLE,  # Udyr
    78: Position.TOP,     # Poppy (also support)
    79: Position.JUNGLE,  # Gragas (also top)
    80: Position.TOP,     # Pantheon (also mid/support)
    81: Position.BOT,     # Ezreal
    82: Position.TOP,     # Mordekaiser
    83: Position.TOP,     # Yorick
    84: Position.MID,     # Akali (also top)
    85: Position.TOP,     # Kennen
    86: Position.TOP,     # Garen
    89: Position.SUPPORT, # Leona
    90: Position.MID,     # Malzahar
    91: Position.MID,     # Talon (also jungle)
    92: Position.TOP,     # Riven
    96: Position.BOT,     # Kog'Maw
    98: Position.TOP,     # Shen
    99: Position.MID,     # Lux (also support)
    101: Position.MID,    # Xerath (also support)
    102: Position.JUNGLE, # Shyvana
    103: Position.MID,    # Ahri
    104: Position.JUNGLE, # Graves
    105: Position.MID,    # Fizz
    106: Position.JUNGLE, # Volibear (also top)
    107: Position.JUNGLE, # Rengar
    110: Position.BOT,    # Varus
    111: Position.SUPPORT,# Nautilus
    112: Position.MID,    # Viktor
    113: Position.JUNGLE, # Sejuani
    114: Position.TOP,    # Fiora
    115: Position.MID,    # Ziggs (also bot)
    117: Position.SUPPORT,# Lulu
    119: Position.BOT,    # Draven
    120: Position.JUNGLE, # Hecarim
    121: Position.JUNGLE, # Kha'Zix
    122: Position.TOP,    # Darius
    126: Position.TOP,    # Jayce (also mid)
    127: Position.MID,    # Lissandra
    131: Position.JUNGLE, # Diana (also mid)
    133: Position.TOP,    # Quinn
    134: Position.MID,    # Syndra
    136: Position.MID,    # Aurelion Sol
    141: Position.JUNGLE, # Kayn
    142: Position.MID,    # Zoe
    143: Position.SUPPORT,# Zyra
    145: Position.BOT,    # Kai'Sa
    147: Position.SUPPORT,# Seraphine (also mid/bot)
    150: Position.TOP,    # Gnar
    154: Position.JUNGLE, # Zac
    157: Position.MID,    # Yasuo (also top)
    161: Position.SUPPORT,# Vel'Koz (also mid)
    163: Position.MID,    # Taliyah (also jungle)
    164: Position.TOP,    # Camille
    166: Position.MID,    # Akshan
    200: Position.JUNGLE, # Bel'Veth
    201: Position.SUPPORT,# Braum
    202: Position.BOT,    # Jhin
    203: Position.JUNGLE, # Kindred
    221: Position.BOT,    # Zeri
    222: Position.BOT,    # Jinx
    223: Position.TOP,    # Tahm Kench (also support)
    234: Position.JUNGLE, # Viego
    235: Position.SUPPORT,# Senna (also bot)
    236: Position.BOT,    # Lucian
    238: Position.MID,    # Zed
    240: Position.TOP,    # Kled
    245: Position.MID,    # Ekko (also jungle)
    246: Position.MID,    # Qiyana (also jungle)
    254: Position.JUNGLE, # Vi
    266: Position.TOP,    # Aatrox
    267: Position.SUPPORT,# Nami
    268: Position.MID,    # Azir
    350: Position.SUPPORT,# Yuumi
    360: Position.BOT,    # Samira
    412: Position.SUPPORT,# Thresh
    420: Position.TOP,    # Illaoi
    421: Position.JUNGLE, # Rek'Sai
    427: Position.JUNGLE, # Ivern
    429: Position.BOT,    # Kalista
    432: Position.SUPPORT,# Bard
    497: Position.SUPPORT,# Rakan
    498: Position.BOT,    # Xayah
    516: Position.TOP,    # Ornn
    517: Position.MID,    # Sylas (also jungle)
    518: Position.MID,    # Neeko (also support)
    523: Position.BOT,    # Aphelios
    526: Position.SUPPORT,# Rell
    555: Position.SUPPORT,# Pyke
    711: Position.MID,    # Vex
    777: Position.MID,    # Yone (also top)
    875: Position.TOP,    # Sett
    876: Position.JUNGLE, # Lillia
    887: Position.TOP,    # Gwen
    888: Position.SUPPORT,# Renata Glasc
    893: Position.MID,    # Aurora
    895: Position.BOT,    # Nilah
    897: Position.TOP,    # K'Sante
    901: Position.BOT,    # Smolder
    902: Position.SUPPORT,# Milio
    910: Position.MID,    # Hwei
    950: Position.JUNGLE, # Naafiri (also mid)
    799: Position.TOP,    # Ambessa
    804: Position.MID,    # Yunara
    904: Position.MID,    # Zaahen
}


def infer_position(champion_id: int, spell1_id: int, spell2_id: int) -> Position:
    """Infer player position based on champion and summoner spells.

    Args:
        champion_id: The champion being played.
        spell1_id: First summoner spell ID.
        spell2_id: Second summoner spell ID.

    Returns:
        The inferred position for this player.
    """
    # Smite = Jungle (most reliable indicator)
    if spell1_id == SMITE_SPELL_ID or spell2_id == SMITE_SPELL_ID:
        return Position.JUNGLE

    # Otherwise, use champion typical position
    return CHAMPION_POSITIONS.get(champion_id, Position.UNKNOWN)


def infer_team_positions(
    participants: list[dict],
) -> dict[str, Position]:
    """Infer positions for all players on a team.

    Uses a combination of Smite detection and champion role data.
    Ensures each position is only assigned once per team.

    Args:
        participants: List of participant dicts with puuid, champion_id, spell1_id, spell2_id.

    Returns:
        Dict mapping puuid to inferred position.
    """
    positions: dict[str, Position] = {}
    assigned_positions: set[Position] = set()

    # First pass: Assign Junglers (Smite is definitive)
    for p in participants:
        if p["spell1_id"] == SMITE_SPELL_ID or p["spell2_id"] == SMITE_SPELL_ID:
            positions[p["puuid"]] = Position.JUNGLE
            assigned_positions.add(Position.JUNGLE)

    # Second pass: Assign based on champion typical position
    # Sort by how "certain" we are about each champion's position
    remaining = [p for p in participants if p["puuid"] not in positions]

    for p in remaining:
        champion_pos = CHAMPION_POSITIONS.get(p["champion_id"], Position.UNKNOWN)

        if champion_pos not in assigned_positions and champion_pos != Position.UNKNOWN:
            positions[p["puuid"]] = champion_pos
            assigned_positions.add(champion_pos)
        else:
            # Position already taken or unknown, will assign in final pass
            positions[p["puuid"]] = Position.UNKNOWN

    # Final pass: Assign remaining positions to unknowns
    all_positions = [Position.TOP, Position.JUNGLE, Position.MID, Position.BOT, Position.SUPPORT]
    unassigned = [pos for pos in all_positions if pos not in assigned_positions]

    for puuid, pos in positions.items():
        if pos == Position.UNKNOWN and unassigned:
            positions[puuid] = unassigned.pop(0)

    return positions
